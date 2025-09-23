import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";

const app = express();
dotenv.config();
connectDb();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
