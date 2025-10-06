import axios from "axios";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/trycatch.js";
import { redisClient } from "../utils/redis.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";

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

export const addComments = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id: blogid } = req.params;
  const { comment } = req.body;
  await sql`INSERT INTO comments (userid, blogid, comments) VALUES (${req.user?._id}, ${blogid}, ${comment}),${req.user?.name}RETURNING *`;
  res.status(201).json({ message: "comment added successfully" });
});

export const getAllComments = TryCatch(async (req, res) => {
  const { id } = req.params;
  const comments =
    await sql`SELECT * FROM comments WHERE blogid = ${id} ORDER BY create_at DESC`;

  res.json(comments);
});
export const deleteComments = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { commentid } = req.params;
    const comment = await sql`SELECT * FROM comments WHERE id = ${commentid}`;
    if (comment[0]?.userid !== req.user?._id) {
      res.status(401).json({
        message: "You are not owner of this comment",
      });
      return;
    }

    await sql`DELETE FROM comments WHERE id = ${commentid}`;

    res.json({
      message: "Comment Deleted",
    });
  }
);

export const saveBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { blogid } = req.params;
  const userid = req.user?._id;

  if (!blogid || !userid) {
    res.status(400).json({
      message: "Missing blog id or userid",
    });
    return;
  }

  const existing =
    await sql`SELECT * FROM saveblogs WHERE userid = ${userid} AND blogid = ${blogid}`;

  if (existing.length === 0) {
    await sql`INSERT INTO saveblogs (blogid, userid) VALUES (${blogid}, ${userid})`;

    res.json({
      message: "Blog Saved",
    });
    return;
  } else {
    await sql`DELETE FROM saveblogs WHERE userid = ${userid} AND blogid = ${blogid}`;

    res.json({
      message: "Blog Unsaved",
    });
    return;
  }
});

export const getSavedBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const blogs =
    await sql`SELECT * FROM saveblogs WHERE userid = ${req.user?._id}`;

  res.json(blogs);
});
