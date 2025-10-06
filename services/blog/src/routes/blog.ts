import express from "express";
import {
  addComments,
  deleteComments,
  getAllBlog,
  getAllComments,
  getSavedBlog,
  getSingleBlog,
  saveBlog,
} from "../controllers/blog.js";
import { isAuth } from "../middleware/isAuth.js";
const route = express.Router();
route.get("/blog/all", getAllBlog);
route.get("/blog/:id", getSingleBlog);
route.post("/comment/:id", isAuth, addComments);
route.get("/comment/:id", getAllComments);
route.delete("/comment/:commentid", isAuth, deleteComments);
route.post("/save/:blogid", isAuth, saveBlog);
route.get("/blog/save/all", isAuth, getSavedBlog);
export default route;
