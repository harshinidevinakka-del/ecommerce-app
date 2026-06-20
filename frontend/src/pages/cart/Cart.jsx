import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Button from "../../components/common/Button";

const Cart = () => {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
        <Link to="/products" className="text-blue-600 hover:underline mt-2 inline-block">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* ── Cart Items ──────────────────────────────────── */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product;
            const imageUrl = product?.images?.[0]?.url || "https://via.placeholder.com/100x100?text=No+Image";

            return (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <img src={imageUrl} alt={product?.name} className="w-20 h-20 object-cover rounded-lg" />

                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{product?.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price} each</p>
                </div>

                <input
                  type="number"
                  min="1"
                  max={product?.stock || 99}
                  value={item.quantity}
                  onChange={(e) => updateItem(product._id, Number(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center"
                />

                <p className="w-20 text-right font-semibold text-gray-800">
                  ₹{item.price * item.quantity}
                </p>

                <button
                  onClick={() => removeItem(product._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Order Summary ───────────────────────────────── */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Shipping & tax calculated at checkout
          </p>
          <Button onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;