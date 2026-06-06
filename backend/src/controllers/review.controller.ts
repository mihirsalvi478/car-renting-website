import { Request, Response } from "express";
import prisma from "../db/db";

// Add a review for a car
export const createReview = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { carId } = req.params;
        const { rating, comment } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Valid rating (1-5) is required" });
        }

        // 1. Verify the user has actually booked this car
        const hasBooked = await prisma.booking.findFirst({
            where: {
                userId: userId,
                carId: carId,
                // Optional: you could restrict this to 'confirmed' bookings only
            },
        });

        if (!hasBooked) {
            return res.status(403).json({
                message: "You can only review cars you have booked.",
            });
        }

        // 2. Check if user already reviewed this car
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_carId: {
                    userId: userId,
                    carId: carId,
                },
            },
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this car.",
            });
        }

        // 3. Create the review
        const newReview = await prisma.review.create({
            data: {
                rating,
                comment: comment || "",
                userId,
                carId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        res.status(201).json({ message: "Review submitted successfully", review: newReview });
    } catch (error) {
        console.error("Create review error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get reviews for a specific car
export const getCarReviews = async (req: Request, res: Response) => {
    try {
        const { carId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { carId },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Calculate average rating
        const totalReviews = reviews.length;
        const avgRating =
            totalReviews > 0
                ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / totalReviews
                : 0;

        res.status(200).json({
            reviews,
            totalReviews,
            avgRating: Number(avgRating.toFixed(1)),
        });
    } catch (error) {
        console.error("Get reviews error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
