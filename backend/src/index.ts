import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.route";
import carRoutes from "./routes/car.route";
import packageRoutes from "./routes/packages.route";
import contactRoutes from "./routes/contact.route";
import bookingRoutes from "./routes/booking.routes";
import adminRoutes from "./routes/admin.routes";
import prisma from "./db/db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/cars", carRoutes);
app.use("/packages", packageRoutes);
app.use("/contact", contactRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", require("./routes/review.route").default);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully via Prisma");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
  console.log("App is up and running");
});
