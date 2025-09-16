import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-6">Billing App</h2>
        <nav className="flex-1 space-y-3">
          <Link
            to="/units"
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            Units
          </Link>
          <Link
            to="/tax-rates"
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            Tax Rates
          </Link>
          <Link
            to="/products"
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            Products
          </Link>
          <Link
            to="/invoices"
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            Invoices
          </Link>
          <Link
            to="/payments"
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            Payments
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet /> {/* Nested route render here */}
      </main>
    </div>
  );
}
