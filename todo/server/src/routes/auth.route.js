import { Router } from "express";
import {
    currentUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/auth.controller.js";
import { uploadAvatar } from "../middleware/multer.middleware.js";
import { verifyJWT } from "./../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  uploadAvatar.fields([
    { name: "avatar", maxCount: 1 }
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").get(verifyJWT, logoutUser);

router.route("/get-me").get(verifyJWT, currentUser);

export default router;
