import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
  aiBlogResponse,
  aiDescriptionResponce,
  aiTitleResponce,
  createBlog,
  deleteBlog,
  listGeminiModels,
  updateBlog,
} from "../controllers/blog.js";
import uploadFile from "../middleware/multer.js";
const router = express.Router();
router.post("/blog/new", isAuth, uploadFile, createBlog);
router.post("/blog/:id", isAuth, uploadFile, updateBlog);
router.delete("/blog/:id", isAuth, deleteBlog);
router.post("/ai/title", aiTitleResponce);
router.post("/ai/description", aiDescriptionResponce);
router.post("/ai/blog", aiBlogResponse);
router.get("/gemini-models", listGeminiModels);

export default router;
