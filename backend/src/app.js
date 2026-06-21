import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

// ── CORS Configuration ───────────────────────────────────────
// Allows requests from your local dev frontend AND your deployed frontend (set via env var)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // will be set on Render once Vercel URL is known
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;