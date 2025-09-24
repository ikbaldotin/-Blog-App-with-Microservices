import express from "express";
import {
  getUserProfile,
  loginUser,
  myProfile,
  updatedProfilePic,
  updatedUser,
} from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
const router = express.Router();
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.get("/user/:id", getUserProfile);
router.post("/user/update", isAuth, updatedUser);
router.post("/user/updatepic", isAuth, uploadFile, updatedProfilePic);

export default router;
