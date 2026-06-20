import api from "./api";

// Calls GET /api/products with optional query params (keyword, category, minPrice, maxPrice, sort, page, limit)
export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};

// Calls GET /api/products/:id
export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};