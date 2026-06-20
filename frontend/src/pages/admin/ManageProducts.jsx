import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getProducts } from "../../services/productService";
import { deleteProduct } from "../../services/adminService";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ limit: 100 }); // simple approach: fetch up to 100 for admin view
      setProducts(data.products);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <Link to="/admin/products/add">
          <Button>+ Add Product</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b last:border-0">
                <td className="py-3 px-4 text-gray-800 font-medium">{product.name}</td>
                <td className="py-3 px-4 text-gray-600">{product.category}</td>
                <td className="py-3 px-4 text-gray-600">₹{product.price}</td>
                <td className="py-3 px-4">
                  <span className={product.stock <= 10 ? "text-red-500 font-medium" : "text-gray-600"}>
                    {product.stock}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-3">
                  <Link to={`/admin/products/edit/${product._id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center text-gray-400 py-10">No products yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;