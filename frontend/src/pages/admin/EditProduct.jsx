import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProductForm from "../../components/product/ProductForm";
import { updateProduct } from "../../services/adminService";
import { getProductById } from "../../services/productService";
import Loader from "../../components/common/Loader";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (payload) => {
    setLoading(true);
    try {
      await updateProduct(id, payload);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update product";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>
      <div className="max-w-2xl">
        <ProductForm initialData={product} onSubmit={handleUpdate} loading={loading} />
      </div>
    </div>
  );
};

export default EditProduct;