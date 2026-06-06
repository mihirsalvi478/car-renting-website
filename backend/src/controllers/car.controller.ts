import { Request, Response } from "express";
import prisma from "../db/db";

export const getAllCars = async (_req: Request, res: Response) => {
  try {
    const cars = await prisma.car.findMany({
      include: {
        reviews: {
          select: { rating: true },
        },
      },
    });

    const carsWithRatings = cars.map((car) => {
      const avgRating =
        car.reviews.length > 0
          ? car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length
          : 0;

      const { reviews, ...carData } = car;
      return {
        ...carData,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    });

    res.status(200).json(carsWithRatings);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Error fetching cars", details: error });
  }
};

export const getCarDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ error: "Invalid car ID" });
    }

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        reviews: {
          select: { rating: true },
        },
      },
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    const avgRating =
      car.reviews.length > 0
        ? car.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / car.reviews.length
        : 0;

    const { reviews, ...carData } = car;

    res.status(200).json({
      ...carData,
      avgRating: Number(avgRating.toFixed(1)),
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching car details:", error);
    res.status(500).json({ error: "Error fetching car details", details: error });
  }
};

export const bookCar = async (req: Request, res: Response) => {
  const { carId } = req.body;

  try {
    if (!carId || carId === "undefined") {
      return res.status(400).json({ error: "Invalid car ID" });
    }

    const car = await prisma.car.findUnique({ where: { id: carId } });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    if (!car.availability) {
      return res.status(400).json({ error: "Car is already booked" });
    }

    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: { availability: false },
    });

    res.status(200).json({
      message: "Car booked successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Error booking car:", error);
    res.status(500).json({ error: "Error booking car", details: error });
  }
};
