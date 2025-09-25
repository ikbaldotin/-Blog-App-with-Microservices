import axios from "axios";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/trycatch.js";
import { redisClient } from "../utils/redis.js";

export const getAllBlog = TryCatch(async (req, res) => {
  const { serchQuery, category } = req.query;
  const cacheKey = `blog:${serchQuery}:${category}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log("Serving from Redis cache");
    res.json(JSON.parse(cached));
    return;
  }
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
  } else if (category) {
    blogs =
      await sql`SELECT * FROM blog WHERE category = ${category} ORDER BY create_at DESC`;
  } else {
    blogs = await sql`SELECT * FROM blog ORDER BY create_at DESC`;
  }
  console.log("Serving from Database");
  await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3060 });
  res.status(200).json(blogs);
});

export const getSingleBlog = TryCatch(async (req, res) => {
  const blogid = req.params.id;
  const cacheKey = `blog:${blogid}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log("Serving single from Redis cache");
    res.json(JSON.parse(cached));
    return;
  }
  const blog = await sql`SELECT * FROM blog WHERE id = ${blogid}`;
  if (blog.length === 0) {
    res.status(404).json({ message: "no blog id found" });
    return;
  }
  const { data } = await axios.get(
    `${process.env.USER_SERVICE}/api/v1/user/${blog[0]?.author}`
  );
  const responseData = { blog: blog[0], author: data };
  await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3060 });
  res.json(responseData);
});
