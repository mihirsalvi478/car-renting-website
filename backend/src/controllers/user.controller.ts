import { Request, Response } from "express";
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
