import mongoose, { isValidObjectId } from "mongoose";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import { File } from "../models/files.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const changeFiles = asyncHandler(async (req, res) => {
  const { name, selectedPages } = req.body;
  if (!name) {
    throw new ApiError(400, "Name should be mentioned");
  }
  const pdfLocalPath = req.file?.path;
  if (!pdfLocalPath) {
    throw new ApiError(422, "No file uploaded!");
  }

  const pdf = await uploadOnCloudinary(pdfLocalPath);

  if (!pdf) {
    throw new ApiError(500, "Failed to save files on cloudinary");
  }

  console.log(pdf);
  const pdfDoc = await PDFDocument.load(
    await fetch(pdf.url).then((res) => res.arrayBuffer())
  );

  const selectedPagesArray = selectedPages
    .split(",")
    .map((pageNumber) => parseInt(pageNumber.trim(), 10));

  const mergedPdfDoc = await PDFDocument.create();

  for (const pageNumber of selectedPagesArray) {
    if (pageNumber > 0 && pageNumber <= pdfDoc.getPageCount()) {
      const [copiedPage] = await mergedPdfDoc.copyPages(pdfDoc, [
        pageNumber - 1,
      ]);
      mergedPdfDoc.addPage(copiedPage);
    } else {
      throw new Error(`Invalid page number: ${pageNumber}`);
    }
  }
  const mergedPdfBytes = await mergedPdfDoc.save();
  console.log(mergedPdfBytes);

  const destinationDirectory = "../../public/temp/";

  const uniqueFilename = `pdf_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}.pdf`;

  const filePath = path.join(destinationDirectory, uniqueFilename);
  fs.writeFileSync(filePath, Buffer.from(mergedPdfBytes));

  console.log(`PDF file saved to: ${filePath}`);

  const newFile = await uploadOnCloudinary(filePath);
  if (!newFile) {
    throw new ApiError(500, "Something went wrong while creating new file");
  }
  const files = await File.create({
    name,
    orginal: pdf.url,
    modified: newFile.url,
    owner: req.user._id,
  });

  if (!files) {
    throw new ApiError(500, "Something went wrong while uploading to database");
  }

  const user = await User.findById(req.user?.id);

  user.files.push(files._id);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, files, "Files uploaded successfully"));
});

const deleteFiles = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  if (!fileId || !isValidObjectId(fileId)) {
    throw new ApiError(400, "Invalid ID");
  }

  const file = await File.findById(fileId);

  if (req.user?._id.toString() != file?.owner.toString()) {
    throw new ApiError(401, "You are not authorized to perform this action");
  }

  await File.findByIdAndDelete(fileId);

  await User.updateOne({ _id: req.user._id }, { $pull: { files: fileId } });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "File has been deleted"));
});

const getFileById = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  if (!fileId || !isValidObjectId(fileId)) {
    throw new ApiError(400, "Invalid id");
  }

  const file = await File.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }
  if (req.user?._id.toString() !== file?.owner.toString()) {
    throw new ApiError(401, "You are not authorized to access this");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, file, "File fetched successfully"));
});

export { changeFiles, deleteFiles, getFileById };
