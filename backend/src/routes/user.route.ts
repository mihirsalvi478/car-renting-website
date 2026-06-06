import express from "express";
import {
    addToCart,
    changePassword,
    confirmCart,
    getUserCart,
    getUserProfile,
    getUserStats,
    removeFromCart,
    updateUserProfile,
} from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";


const userRoutes = express.Router();

userRoutes.get("/profile", authMiddleware, getUserProfile);
userRoutes.put("/profile", authMiddleware, updateUserProfile);
userRoutes.put("/profile/password", authMiddleware, changePassword);
userRoutes.get("/profile/stats", authMiddleware, getUserStats);
userRoutes.post("/cart/add", authMiddleware, addToCart);
userRoutes.post("/cart/remove", authMiddleware, removeFromCart);
userRoutes.get("/cart", authMiddleware, getUserCart);
userRoutes.post("/cart/confirm", authMiddleware, confirmCart);

export default userRoutes;
