import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect); // every order route requires login

router.post("/", placeOrder);
router.get("/myorders", getMyOrders);
router.get("/", adminOnly, getAllOrders);          // admin only
router.put("/:id/status", adminOnly, updateOrderStatus); // admin only
router.get("/:id", getOrderById);                  // owner or admin (checked in controller)

export default router;