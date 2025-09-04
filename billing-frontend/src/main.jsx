import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/Login";
import ProductsPage from "./pages/Products";

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/*",
      element: <App />,
    },
    {
      path: "/products",
      element: <ProductsPage />,
    }
  ],
  {
    future: {
      v7_startTransition: true,  // ✅ future flag enable
    },
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
