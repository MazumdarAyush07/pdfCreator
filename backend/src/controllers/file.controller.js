import mongoose, { isValidObjectId } from "mongoose";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import { File } from "../models/files.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const changeFiles = asyncHandler(async (req, res) => {
  const { name } = req.body;
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

  const selectedPages = req.body.selectedPages.map((pageNumber) =>
    parseInt(pageNumber, 10)
  );

  const mergedPdfDoc = await PDFDocument.create();

  for (const pageNumber of selectedPages) {
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

  // Generate a unique filename (e.g., timestamp + random string)
  const uniqueFilename = `pdf_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}.pdf`;

  // Write the PDF data to the file
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
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "File has been deleted"));
});

export { changeFiles, deleteFiles };