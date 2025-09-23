import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoutes from "./routes/user.js";
const app = express();
dotenv.config();
connectDb();
app.use(express.json());
app.use("/api/v1", userRoutes);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
