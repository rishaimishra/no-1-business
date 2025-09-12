import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Products from "./pages/Products";
import InvoiceList from "./pages/InvoiceList";
import PaymentList from "./pages/PaymentList"; // future
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "products", element: <Products /> },
      { path: "invoices", element: <InvoiceList /> },
      { path: "payments", element: <PaymentList /> }, // future
      { path: "*", element: <Navigate to="/products" replace /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
