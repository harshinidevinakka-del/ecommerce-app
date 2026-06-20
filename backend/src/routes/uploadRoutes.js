import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// "image" must match the field name the frontend sends in FormData
router.post("/", protect, adminOnly, upload.single("image"), uploadImage);

export default router;