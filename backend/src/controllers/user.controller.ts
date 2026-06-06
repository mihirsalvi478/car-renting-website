import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../db/db";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const { itemId, itemType, price } = req.body;

  if (!itemId || !itemType || !price) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: req.user!.id,
        itemId,
        itemType,
        price,
      },
    });

    const cart = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
    });

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({ error: "Error adding item to cart" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { itemId } = req.body;

  if (!itemId) {
    res.status(400).json({ error: "Item ID is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: req.user!.id,
        itemId: itemId,
      },
    });

    const cart = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
    });

    res
      .status(200)
      .json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ error: "Error removing item from cart" });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
    });

    if (!cart) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
};

export const confirmCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
    });

    if (cartItems.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    // Create bookings for each car item in the cart
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 1); // Default 1-day booking

    const bookingPromises = cartItems
      .filter((item) => item.itemType === "car")
      .map((item) =>
        prisma.booking.create({
          data: {
            userId,
            carId: item.itemId,
            startDate: now,
            endDate: endDate,
            totalPrice: item.price,
            status: "pending",
          },
        })
      );

    const bookings = await Promise.all(bookingPromises);

    // Clear the cart after creating bookings
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    res.status(200).json({ message: "Booking confirmed", bookings });
  } catch (error) {
    console.error("confirmCart error:", error);
    res.status(500).json({ error: "Error confirming booking" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const userId = req.user!.id;

    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== userId) {
        res.status(400).json({ error: "Email is already in use" });
        return;
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user!.id;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: "Old and new passwords are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error);
    res.status(500).json({ error: "Error changing password" });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { car: { select: { type: true } } },
    });

    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Find most booked car type
    const typeCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      const t = b.car.type;
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    const favoriteCarType =
      Object.keys(typeCounts).length > 0
        ? Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]
        : null;

    res.status(200).json({ totalBookings, totalSpent, favoriteCarType });
  } catch (error) {
    console.error("getUserStats error:", error);
    res.status(500).json({ error: "Error fetching stats" });
  }
};
