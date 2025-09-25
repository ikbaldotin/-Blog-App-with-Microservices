import express, { Router } from "express";
import dotenv from "dotenv";
import BlogRoute from "./routes/blog.js";
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use("/api/v1", BlogRoute);
app.listen(port, () => {
  console.log(`server is running port on${port}`);
});
