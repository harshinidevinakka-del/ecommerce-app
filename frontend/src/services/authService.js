import api from "./api";

// Calls POST /api/auth/register
export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

// Calls POST /api/auth/login
export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

// Calls GET /api/auth/profile
export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};