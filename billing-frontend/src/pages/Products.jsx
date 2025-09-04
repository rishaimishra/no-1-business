import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await API.post("/products", { name, sale_price: salePrice });
    setName("");
    setSalePrice("");
    fetchProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <button onClick={handleLogout} className="text-red-500">Logout</button>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          placeholder="Product Name"
          className="border p-2 rounded flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Sale Price"
          className="border p-2 rounded w-32"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 rounded">Add</button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">₹{p.sale_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
