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
