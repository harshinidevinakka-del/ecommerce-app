import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProductForm from "../../components/product/ProductForm";
import { createProduct } from "../../services/adminService";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (payload) => {
    setLoading(true);
    try {
      await createProduct(payload);
      toast.success("Product created successfully");
      navigate("/admin/products");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create product";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
      <div className="max-w-2xl">
        <ProductForm onSubmit={handleCreate} loading={loading} />
      </div>
    </div>
  );
};

export default AddProduct;