import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import Loader from "../../components/common/Loader";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-20">Order not found.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-800">Order Placed Successfully!</h1>
      <p className="text-gray-500 mt-2">
        Order ID: <span className="font-mono text-gray-700">{order._id}</span>
      </p>

      <div className="bg-white text-left p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
        <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
        {order.orderItems.map((item) => (
          <div key={item._id} className="flex justify-between text-sm text-gray-600 py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-gray-800">
          <span>Total Paid</span>
          <span>₹{order.totalPrice}</span>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Status: <span className="font-medium text-blue-600">{order.orderStatus}</span>
        </p>
      </div>

      <Link to="/products" className="text-blue-600 hover:underline mt-6 inline-block">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;