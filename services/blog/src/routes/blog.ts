import express from "express";
import { getAllBlog, getSingleBlog } from "../controllers/blog.js";
const route = express.Router();
route.get("/blog/all", getAllBlog);
route.get("/blog/:id", getSingleBlog);
export default route;
