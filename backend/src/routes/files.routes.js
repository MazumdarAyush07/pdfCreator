import { Router } from "express";
import { changeFiles, deleteFiles } from "../controllers/file.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(upload.single("pdfFile"), changeFiles); //tested successfully
router.route("/delete/:fileId").delete(deleteFiles); //tested successfully

export default router;
