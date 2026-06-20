import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// ── @desc    Get dashboard summary stats
// ── @route   GET /api/admin/stats
// ── @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Total revenue from all orders (regardless of payment status, since COD is allowed)
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Orders grouped by status (for a pie/bar chart on the dashboard)
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      ordersByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get low-stock products (inventory alert)
// ── @route   GET /api/admin/low-stock
// ── @access  Private/Admin
export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 10; // default threshold: 10 units

    const lowStockProducts = await Product.find({ stock: { $lte: threshold } })
      .select("name stock category price")
      .sort({ stock: 1 });

    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get recent orders (latest 10, for dashboard activity feed)
// ── @route   GET /api/admin/recent-orders
// ── @access  Private/Admin
export const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get all users (Admin user management)
// ── @route   GET /api/admin/users
// ── @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Update a user's role (promote/demote admin)
// ── @route   PUT /api/admin/users/:id/role
// ── @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated", user: { _id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};