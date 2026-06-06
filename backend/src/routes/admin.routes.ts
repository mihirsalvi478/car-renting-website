import express, { RequestHandler } from "express";
import authMiddleware from "../middleware/auth.middleware";
import adminMiddleware from "../middleware/admin.middleware";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllBookingsAdmin,
  updateBookingStatus,
  deleteBookingAdmin,
  addCar,
  updateCar,
  deleteCar,
} from "../controllers/admin.controller";

const adminRoutes = express.Router();

// All admin routes require authentication + admin role
adminRoutes.use(authMiddleware as RequestHandler);
adminRoutes.use(adminMiddleware as RequestHandler);

// Dashboard
adminRoutes.get("/stats", getDashboardStats as RequestHandler);

// User Management
adminRoutes.get("/users", getAllUsers as RequestHandler);
adminRoutes.delete("/users/:id", deleteUser as RequestHandler);

// Booking Management
adminRoutes.get("/bookings", getAllBookingsAdmin as RequestHandler);
adminRoutes.patch("/bookings/:id", updateBookingStatus as RequestHandler);
adminRoutes.delete("/bookings/:id", deleteBookingAdmin as RequestHandler);

// Car Management
adminRoutes.post("/cars", addCar as RequestHandler);
adminRoutes.put("/cars/:id", updateCar as RequestHandler);
adminRoutes.delete("/cars/:id", deleteCar as RequestHandler);

export default adminRoutes;
