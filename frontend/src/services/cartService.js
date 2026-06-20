import api from "./api";

// GET /api/cart
export const fetchCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

// POST /api/cart
export const addToCart = async (productId, quantity = 1) => {
  const { data } = await api.post("/cart", { productId, quantity });
  return data;
};

// PUT /api/cart/:productId
export const updateCartItem = async (productId, quantity) => {
  const { data } = await api.put(`/cart/${productId}`, { quantity });
  return data;
};

// DELETE /api/cart/:productId
export const removeCartItem = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

// DELETE /api/cart
export const clearCart = async () => {
  const { data } = await api.delete("/cart");
  return data;
};