import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoutes from "./routes/user.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
const app = express();
app.use(cors());
dotenv.config();
cloudinary.config({
  cloud_name: process.env.Cloud_Name as string,
  api_key: process.env.Cloud_Api_Key as string,
  api_secret: process.env.Cloud_Api_Secret as string,
});
connectDb();
app.use(express.json());
app.use("/api/v1", userRoutes);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
