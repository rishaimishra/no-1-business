import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Products({ setToken }) {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        if (setToken) setToken(null);
        navigate("/login");
      } else {
        setError("Failed to fetch products. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !salePrice) {
      setError("Please fill all fields");
      return;
    }
    try {
      await API.post("/products", { name, sale_price: salePrice });
      setName("");
      setSalePrice("");
      fetchProducts();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        if (setToken) setToken(null);
        navigate("/login");
      } else {
        setError("Error adding product.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Only call setToken if it's provided
    if (setToken && typeof setToken === 'function') {
      setToken(null);
    }
    navigate("/login");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">📦 Products</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleAdd}
        className="flex gap-2 mb-6 bg-white p-4 rounded-lg shadow-md"
      >
        <input
          placeholder="Product Name"
          className="border p-2 rounded-lg flex-1 focus:outline-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Sale Price"
          type="number"
          className="border p-2 rounded-lg w-32 focus:outline-blue-500"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
        />
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg transition">
          Add
        </button>
      </form>

      {loading && <p className="text-blue-600">Loading products...</p>}
      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
      )}

      {!loading && products.length > 0 ? (
        <table className="w-full border rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} className="bg-white hover:bg-gray-50">
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">₹{p.sale_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-gray-500">No products available.</p>
      )}
    </div>
  );
}