import { useState, useEffect } from "react";
import { getDashboardStats, getLowStockProducts, getRecentOrders } from "../../services/adminService";
import Loader from "../../components/common/Loader";

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, lowStockData, recentData] = await Promise.all([
          getDashboardStats(),
          getLowStockProducts(10),
          getRecentOrders(),
        ]);
        setStats(statsData);
        setLowStock(lowStockData);
        setRecentOrders(recentData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* ── Stat Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue}`} accent="text-green-600" />
        <StatCard label="Total Orders" value={stats.totalOrders} accent="text-blue-600" />
        <StatCard label="Total Products" value={stats.totalProducts} accent="text-purple-600" />
        <StatCard label="Total Users" value={stats.totalUsers} accent="text-orange-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Orders by Status ─────────────────────────────── */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">Orders by Status</h2>
          {stats.ordersByStatus.length === 0 ? (
            <p className="text-sm text-gray-400">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.ordersByStatus.map((s) => (
                <div key={s._id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{s._id}</span>
                  <span className="font-medium text-gray-800">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Low Stock Alerts ─────────────────────────────── */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">Low Stock Alerts (≤10 units)</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400">All products well-stocked.</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map((p) => (
                <div key={p._id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{p.name}</span>
                  <span className="font-medium text-red-500">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Orders ─────────────────────────────────── */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-6">
        <h2 className="font-semibold text-gray-800 mb-3">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Customer</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b last:border-0">
                  <td className="py-2 text-gray-700">{order.user?.name}</td>
                  <td className="py-2 text-gray-700">₹{order.totalPrice}</td>
                  <td className="py-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;