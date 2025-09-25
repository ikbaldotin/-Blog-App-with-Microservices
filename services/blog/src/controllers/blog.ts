import axios from "axios";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/trycatch.js";

export const getAllBlog = TryCatch(async (req, res) => {
  const { serchQuery, category } = req.query;
  let blogs;
  if (serchQuery && category) {
    blogs = await sql`SELECT * FROM blog WHERE (title ILIKE ${
      `%` + serchQuery + `%`
    } OR description ILIKE ${
      `%` + serchQuery + `%`
    }) AND category = ${category} ORDER BY create_at DESC`;
  } else if (serchQuery) {
    blogs = await sql`SELECT * FROM blog WHERE (title ILIKE ${
      `%` + serchQuery + `%`
    } OR description ILIKE ${`%` + serchQuery + `%`})  ORDER BY create_at DESC`;
  } else {
    blogs = await sql`SELECT * FROM blog ORDER BY create_at DESC`;
  }
  res.status(200).json(blogs);
});

export const getSingleBlog = TryCatch(async (req, res) => {
  const blog = await sql`SELECT * FROM blog WHERE id = ${req.params.id}`;
  const { data } = await axios.get(
    `${process.env.USER_SERVICE}/api/v1/user/${blog[0]?.author}`
  );
  res.json({ blog: blog[0], author: data });
});
