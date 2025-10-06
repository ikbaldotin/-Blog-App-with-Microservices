import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkdin: string;
  bio: string;
}
export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "please login to continue" });
      return;
    }
    const token = authHeader.split(" ")[1] as string;

    const decodedValue = jwt.verify(
      token,
      process.env.JWT_SEC as string
    ) as JwtPayload;
    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({ message: "invalid token" });
      return;
    }
    req.user = decodedValue.user;
    next();
  } catch (error) {
    console.log("JWT verification error", error);
    res.status(401).json({ message: "Unauthorized jwt" });
  }
};
