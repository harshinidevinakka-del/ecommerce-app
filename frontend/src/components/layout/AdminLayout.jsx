import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiBox, FiShoppingBag } from "react-icons/fi";

const AdminLayout = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-8">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
        <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">Admin Panel</h2>
        <nav className="flex flex-col gap-1">
          <NavLink to="/admin" end className={linkClass}>
            <FiGrid /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            <FiBox /> Products
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            <FiShoppingBag /> Orders
          </NavLink>
        </nav>
      </aside>

      {/* ── Page Content ─────────────────────────────────── */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;