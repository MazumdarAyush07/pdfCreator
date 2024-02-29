import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser); //tested successfully
router.route("/login").post(loginUser); //tested successfully
router.route("/logout").post(verifyJWT, logoutUser); //tested successfully
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword); //tested successfully
router.route("/get-currentuser").get(verifyJWT, getCurrentUser);

export default router;
