import express, { Router } from "express";
import dotenv from "dotenv";
import BlogRoute from "./routes/blog.js";
import { redisClient } from "./utils/redis.js";
import { startCacheConsumer } from "./utils/consumer.js";
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;
startCacheConsumer();
redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch(() => console.error);
app.use("/api/v1", BlogRoute);
app.listen(port, () => {
  console.log(`server is running port on${port}`);
});
