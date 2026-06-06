import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization") || req.header("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.header("token");

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as any; // Add `user` to request object
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token expired. Please sign in again." });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}
