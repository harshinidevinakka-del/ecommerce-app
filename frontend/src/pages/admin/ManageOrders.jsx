import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAllOrders, updateOrderStatus } from "../../services/adminService";
import Loader from "../../components/common/Loader";

const STATUS_OPTIONS = ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

const statusColors = {
  Processing: "bg-yellow-50 text-yellow-700",
  Shipped: "bg-blue-50 text-blue-700",
  "Out for Delivery": "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: updated.orderStatus } : o))
      );
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b last:border-0">
                <td className="py-3 px-4 text-gray-500 font-mono text-xs">
                  {order._id.slice(-8)}
                </td>
                <td className="py-3 px-4 text-gray-800">
                  <div>{order.user?.name}</div>
                  <div className="text-xs text-gray-400">{order.user?.email}</div>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
                </td>
                <td className="py-3 px-4 text-gray-800 font-medium">₹{order.totalPrice}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${statusColors[order.orderStatus]}`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center text-gray-400 py-10">No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;