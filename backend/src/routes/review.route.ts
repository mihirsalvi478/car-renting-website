import express from "express";
import { createReview, getCarReviews } from "../controllers/review.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:carId", getCarReviews);
router.post("/:carId", authMiddleware, createReview as any);

export default router;
