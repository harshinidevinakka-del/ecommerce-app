import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";
import { uploadImage } from "../../services/uploadService";

const ProductForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
  });

  // Holds the final { url, public_id } once uploaded
  const [imageData, setImageData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // Pre-fill form when editing an existing product
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category: initialData.category || "",
        brand: initialData.brand || "",
        stock: initialData.stock || "",
      });
      if (initialData.images?.[0]) {
        setImageData(initialData.images[0]);
        setPreviewUrl(initialData.images[0].url);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show an instant local preview while the real upload happens in the background
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const result = await uploadImage(file);
      setImageData(result); // { url, public_id } from Cloudinary
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Image upload failed");
      setPreviewUrl(imageData?.url || "");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      brand: formData.brand,
      stock: Number(formData.stock),
      images: imageData ? [imageData] : [],
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <Input label="Product Name" name="name" value={formData.name} onChange={handleChange} required />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Price (₹)" type="number" name="price" value={formData.price} onChange={handleChange} required />
        <Input label="Stock Quantity" type="number" name="stock" value={formData.stock} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Category" name="category" value={formData.category} onChange={handleChange} required />
        <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
      </div>

      {/* ── Image Upload ──────────────────────────────────── */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg mb-3 border border-gray-200"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-medium"
        />
        {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
      </div>

      <Button type="submit" loading={loading || uploading} className="mt-2">
        {initialData ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
};

export default ProductForm;