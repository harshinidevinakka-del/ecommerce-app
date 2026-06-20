import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url || "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100 flex flex-col"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-medium text-gray-800 mt-1 line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-blue-600">
            ₹{product.price}
          </span>
          {product.stock === 0 ? (
            <span className="text-xs text-red-500 font-medium">Out of stock</span>
          ) : product.stock <= 10 ? (
            <span className="text-xs text-orange-500 font-medium">Low stock</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;