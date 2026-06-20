import api from "./api";

// GET /api/admin/stats
export const getDashboardStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

// GET /api/admin/low-stock?threshold=10
export const getLowStockProducts = async (threshold = 10) => {
  const { data } = await api.get("/admin/low-stock", { params: { threshold } });
  return data;
};

// GET /api/admin/recent-orders
export const getRecentOrders = async () => {
  const { data } = await api.get("/admin/recent-orders");
  return data;
};

// GET /api/admin/users
export const getAllUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data;
};

// ── Product management (admin uses the same product endpoints from Phase 5) ──
export const createProduct = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// ── Order management (admin uses Phase 7 order endpoints) ──
export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const updateOrderStatus = async (id, orderStatus) => {
  const { data } = await api.put(`/orders/${id}/status`, { orderStatus });
  return data;
};