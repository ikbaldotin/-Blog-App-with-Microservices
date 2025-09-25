import express from "express";
import { getAllBlog } from "../controllers/blog.js";
const route = express.Router();
route.get("/blog/all", getAllBlog);
export default route;
