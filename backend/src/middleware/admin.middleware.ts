import { Request, Response, NextFunction } from "express";

export default function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Access denied. Admin privileges required." });
    return;
  }
  next();
}
