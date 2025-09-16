import React, { useEffect, useState } from "react";
import API from "../api"; // axios instance with baseURL + token

export default function TaxRates() {
  const [taxRates, setTaxRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", rate: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchTaxRates = async () => {
    setLoading(true);
    try {
      const res = await API.get("/tax-rates");
      setTaxRates(res.data);
    } catch (err) {
      console.error("Error fetching tax rates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/tax-rates/${editingId}`, form);
      } else {
        await API.post("/tax-rates", form);
      }
      setForm({ name: "", rate: "" });
      setEditingId(null);
      fetchTaxRates();
    } catch (err) {
      console.error("Error saving tax rate", err);
    }
  };

  const handleEdit = (tax) => {
    setForm({ name: tax.name, rate: tax.rate });
    setEditingId(tax.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tax rate?")) return;
    try {
      await API.delete(`/tax-rates/${id}`);
      fetchTaxRates();
    } catch (err) {
      console.error("Error deleting tax rate", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Tax Rates</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-x-2">
        <input
          type="text"
          placeholder="Tax Name (e.g. GST 18%)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Rate (%)"
          value={form.rate}
          onChange={(e) => setForm({ ...form, rate: e.target.value })}
          className="px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", rate: "" });
              setEditingId(null);
            }}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : taxRates.length === 0 ? (
        <p className="text-gray-500">No tax rates found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Rate (%)</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxRates.map((tax) => (
                <tr key={tax.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{tax.name}</td>
                  <td className="px-4 py-2">{tax.rate}%</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(tax)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tax.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
