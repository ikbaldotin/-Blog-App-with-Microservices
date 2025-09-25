import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/trycatch.js";
import cloudinary from "cloudinary";
export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { title, description, blogcontent, category } = req.body;
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }
  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    res.status(400).json({ message: "Invalid file format" });
    return;
  }
  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "blogs",
  });
  const result =
    await sql`INSERT INTO blog (title,description,image,blogcontent,category,author) VALUES (${title},${description},${cloud.secure_url},${blogcontent},${category},${req.user?._id}) RETURNING *`;
  res.status(200).json({
    message: "Blog created successfully",
    blog: result[0],
  });
});
