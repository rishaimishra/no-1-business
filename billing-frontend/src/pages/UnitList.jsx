import React, { useEffect, useState } from "react";
import API from "../api"; // axios instance with baseURL + token

export default function UnitList() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", symbol: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await API.get("/units");
      setUnits(res.data);
    } catch (err) {
      console.error("Error fetching units", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/units/${editingId}`, form);
      } else {
        await API.post("/units", form);
      }
      setForm({ name: "", symbol: "" });
      setEditingId(null);
      fetchUnits();
    } catch (err) {
      console.error("Error saving unit", err);
    }
  };

  const handleEdit = (unit) => {
    setForm({ name: unit.name, symbol: unit.symbol });
    setEditingId(unit.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;
    try {
      await API.delete(`/units/${id}`);
      fetchUnits();
    } catch (err) {
      console.error("Error deleting unit", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Units</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-x-2">
        <input
          type="text"
          placeholder="Unit Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Symbol"
          value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value })}
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
              setForm({ name: "", symbol: "" });
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
      ) : units.length === 0 ? (
        <p className="text-gray-500">No units found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{unit.name}</td>
                  <td className="px-4 py-2">{unit.symbol}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(unit)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(unit.id)}
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
