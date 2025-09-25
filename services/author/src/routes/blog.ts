import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createBlog, updateBlog } from "../controllers/blog.js";
import uploadFile from "../middleware/multer.js";
const router = express.Router();
router.post("/blog/new", isAuth, uploadFile, createBlog);
router.post("/blog/:id", isAuth, uploadFile, updateBlog);
export default router;
