import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductById } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-20">Product not found.</p>;

  const imageUrl = product.images?.[0]?.url || "https://via.placeholder.com/500x500?text=No+Image";

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    try {
      await addItem(product._id, quantity);
    } catch (error) {
      // error toast already shown inside addItem
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <span className="text-sm text-gray-400 uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">{product.name}</h1>
          <p className="text-gray-500 mt-1">{product.brand}</p>

          <p className="text-3xl font-bold text-blue-600 mt-4">₹{product.price}</p>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <p className="mt-4 text-sm">
            {product.stock === 0 ? (
              <span className="text-red-500 font-medium">Out of stock</span>
            ) : (
              <span className="text-green-600 font-medium">{product.stock} in stock</span>
            )}
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mt-6">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <Button onClick={handleAddToCart} className="flex-1">
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;