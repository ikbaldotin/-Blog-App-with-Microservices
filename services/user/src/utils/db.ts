import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const url = process.env.MONGO_URL as string;
    const db = await mongoose.connect(url);
    console.log("connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
