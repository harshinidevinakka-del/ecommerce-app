import express from "express";
import {
  getDashboardStats,
  getLowStockProducts,
  getRecentOrders,
  getAllUsers,
  updateUserRole,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Every route here requires login AND admin role
router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/low-stock", getLowStockProducts);
router.get("/recent-orders", getRecentOrders);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);

export default router;