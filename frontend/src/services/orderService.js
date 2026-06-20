import api from "./api";

// POST /api/orders
export const placeOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

// GET /api/orders/myorders
export const getMyOrders = async () => {
  const { data } = await api.get("/orders/myorders");
  return data;
};

// GET /api/orders/:id
export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};