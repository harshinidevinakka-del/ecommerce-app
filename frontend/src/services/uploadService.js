import api from "./api";

// POST /api/upload — sends a file as multipart/form-data
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file); // "image" must match backend's upload.single("image")

  const { data } = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // { url, public_id }
};