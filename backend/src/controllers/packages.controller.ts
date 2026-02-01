import { Request, Response } from "express";
import prisma from "../db/db";

export const getAllPackages = async (_req: Request, res: Response) => {
  try {
    const packages = await prisma.package.findMany();

    res.status(200).json(packages);
  } catch (error: any) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: error.message || "Error fetching packages" });
  }
};

export const bookPackage = async (req: Request, res: Response) => {
  const { packageId, couponCode } = req.body;

  try {
    const packageDetails = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageDetails) {
      res.status(404).json({ error: "Package not found" });
      return;
    }

    let finalPrice = packageDetails.price;

    if (couponCode && couponCode === packageDetails.couponCode) {
      finalPrice *= 0.9;
    }

    res.status(200).json({
      message: "Package booked successfully",
      packageDetails,
      finalPrice,
    });
  } catch (error: any) {
    console.error("Error booking package:", error);
    res.status(500).json({ error: error.message || "Error booking package" });
  }
};

export const getPackageDetails = async (req: Request, res: Response) => {
  try {
    const foundPackage = await prisma.package.findUnique({
      where: { id: req.params.id },
    });

    if (!foundPackage) {
      res.status(404).json({ error: "Package not found" });
      return;
    }

    res.status(200).json(foundPackage);
  } catch (error: any) {
    console.error("Error fetching package details:", error);
    res
      .status(500)
      .json({ error: error.message || "Error fetching package details" });
  }
};
