import { Request, Response } from "express";
import prisma from "../db/db";

// GET /admin/stats - Dashboard statistics
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [totalUsers, totalCars, totalBookings, totalRevenue, recentBookings] =
      await Promise.all([
        prisma.user.count(),
        prisma.car.count(),
        prisma.booking.count(),
        prisma.booking.aggregate({ _sum: { totalPrice: true } }),
        prisma.booking.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
            car: { select: { name: true, price: true, image: true } },
          },
        }),
      ]);

    res.status(200).json({
      totalUsers,
      totalCars,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentBookings,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Error fetching dashboard stats" });
  }
};

// GET /admin/users - Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { bookings: true, reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// DELETE /admin/users/:id - Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

// GET /admin/bookings - Get all bookings
export const getAllBookingsAdmin = async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        car: { select: { name: true, price: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Error fetching bookings" });
  }
};

// PATCH /admin/bookings/:id - Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.status(200).json(booking);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Error updating booking" });
  }
};

// DELETE /admin/bookings/:id - Delete a booking
export const deleteBookingAdmin = async (req: Request, res: Response) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Error deleting booking" });
  }
};

// POST /admin/cars - Add a new car
export const addCar = async (req: Request, res: Response) => {
  try {
    const { name, type, price, description, image, availability } = req.body;
    const car = await prisma.car.create({
      data: {
        name,
        type,
        price: parseFloat(price),
        description,
        image,
        availability: availability !== undefined ? availability : true,
      },
    });
    res.status(201).json(car);
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Error adding car" });
  }
};

// PUT /admin/cars/:id - Update a car
export const updateCar = async (req: Request, res: Response) => {
  try {
    const { name, type, price, description, image, availability } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (type !== undefined) data.type = type;
    if (price !== undefined) data.price = parseFloat(price);
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (availability !== undefined) data.availability = availability;

    const car = await prisma.car.update({
      where: { id: req.params.id },
      data,
    });
    res.status(200).json(car);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Car not found" });
    }
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Error updating car" });
  }
};

// DELETE /admin/cars/:id - Delete a car
export const deleteCar = async (req: Request, res: Response) => {
  try {
    await prisma.car.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Car not found" });
    }
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Error deleting car" });
  }
};
