import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { placeOrder } from "../../services/orderService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Checkout = () => {
  const { cart, clearCartState } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    country: "India",
    phone: "",
  });

  const items = cart?.items || [];
  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await placeOrder({
        shippingAddress,
        paymentMethod: "Cash on Delivery",
      });
      clearCartState();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order._id}`);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to place order";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* ── Shipping Form ───────────────────────────────── */}
        <form onSubmit={handlePlaceOrder} className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Shipping Address</h2>

          <Input label="Full Name" name="fullName" value={shippingAddress.fullName} onChange={handleChange} required />
          <Input label="Address" name="address" value={shippingAddress.address} onChange={handleChange} required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="City" name="city" value={shippingAddress.city} onChange={handleChange} required />
            <Input label="Postal Code" name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="State" name="state" value={shippingAddress.state} onChange={handleChange} required />
            <Input label="Country" name="country" value={shippingAddress.country} onChange={handleChange} required />
          </div>

          <Input label="Phone" name="phone" value={shippingAddress.phone} onChange={handleChange} required />

          <p className="text-sm text-gray-500 mt-2 mb-4">
            Payment Method: <span className="font-medium text-gray-700">Cash on Delivery</span>
          </p>

          <Button type="submit" loading={loading}>
            Place Order
          </Button>
        </form>

        {/* ── Order Summary ───────────────────────────────── */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Items</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>₹{taxPrice}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-gray-800 text-base">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;