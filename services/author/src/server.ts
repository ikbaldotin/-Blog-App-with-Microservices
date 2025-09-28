import express from "express";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";
import blogRoute from "./routes/blog.js";
import { v2 as cloudinary } from "cloudinary";
import BlogRouter from "./routes/blog.js";
import cors from "cors";
import { connectRabbitmq } from "./utils/rabbitqmq.js";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.Cloud_Name as string,
  api_key: process.env.Cloud_Api_Key as string,
  api_secret: process.env.Cloud_Api_Secret as string,
});
const app = express();
connectRabbitmq();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use("/api/v1", BlogRouter);
async function initDb() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS blog(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        blogcontent TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    await sql`CREATE TABLE IF NOT EXISTS comments(
        id SERIAL PRIMARY KEY,
        comments VARCHAR(255) NOT NULL,
        userid TEXT NOT NULL,
        username VARCHAR(255) NOT NULL,
        blogid VARCHAR(255) NOT NULL,        
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    await sql`CREATE TABLE IF NOT EXISTS saveblogs(
        id SERIAL PRIMARY KEY,
        userid VARCHAR(255) NOT NULL,                
        blogid VARCHAR(255) NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
app.use("/api/v1", blogRoute);
initDb().then(() => {
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
});
