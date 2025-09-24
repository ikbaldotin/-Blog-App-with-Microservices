import type { Request, Response } from "express";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../utils/trycatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
export const loginUser = TryCatch(async (req, res) => {
  const { email, name, image } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name,
      image,
    });
  }
  const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });
  res.status(200).json({ message: "Login Success", user, token });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.json(user);
});

export const getUserProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "No user with this id" });
    return;
  }
  res.json(user);
});

export const updatedUser = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { name, instagram, facebook, linkdin, bio } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      name,
      instagram,
      facebook,
      linkdin,
      bio,
    },
    { new: true }
  );
  const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });
  res.status(200).json({ message: "userUpdated Success", user, token });
});

export const updatedProfilePic = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      res.status(400).json({ message: "Invalid file format" });
      return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "blog",
    });
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        image: cloud.secure_url,
      },
      { new: true }
    );
    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
      expiresIn: "7d",
    });
    res
      .status(200)
      .json({
        message: "user profile picture updated successfully",
        user,
        token,
      });
  }
);
