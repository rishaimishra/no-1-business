import React, { useEffect, useState } from "react";
// import axios from "axios";
import API from "../api";

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [parties, setParties] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    party_id: "",
    invoice_id: "",
    amount: "",
    method: "cash",
    payment_date: "",
    reference: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchPayments();
    fetchParties();
    fetchInvoices();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await API.get("/payments");
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParties = async () => {
    try {
      const res = await API.get("/parties");
      console.log(res.data);
      
      setParties(res.data.data);
    } catch (err) {
      console.error("Error fetching parties", err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/invoices");
      setInvoices(res.data.data);
    } catch (err) {
      console.error("Error fetching invoices", err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save payment (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/api/payments/${editingId}`, form);
      } else {
        await API.post("/payments", form);
      }
      resetForm();
      fetchPayments();
    } catch (err) {
      console.error("Error saving payment", err);
    }
  };

  // Edit payment
  const handleEdit = (payment) => {
    setForm({
      party_id: payment.party_id || "",
      invoice_id: payment.invoice_id || "",
      amount: payment.amount,
      method: payment.method,
      payment_date: payment.date,
      reference: payment.reference || "",
    });
    setEditingId(payment.id);
  };

  // Delete payment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this payment?")) return;
    try {
      await API.delete(`/api/payments/${id}`);
      fetchPayments();
    } catch (err) {
      console.error("Error deleting payment", err);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      party_id: "",
      invoice_id: "",
      amount: "",
      method: "cash",
      payment_date: "",
      reference: "",
    });
    setEditingId(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Payments</h1>

      {/* Payment Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 p-4 border rounded-lg shadow-md mb-6"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Party Dropdown */}
          <select
            name="party_id"
            value={form.party_id}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Party</option>
            {parties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Invoice Dropdown */}
          <select
            name="invoice_id"
            value={form.invoice_id}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Invoice (optional)</option>
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                #{inv.id} - {inv.grand_total}
              </option>
            ))}
          </select>

          {/* Amount */}
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          {/* Method */}
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="bank">Bank</option>
          </select>

          {/* Date */}
          <input
            type="date"
            name="payment_date"
            value={form.payment_date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          {/* Reference */}
          <input
            type="text"
            name="reference"
            placeholder="Reference"
            value={form.reference}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? "Update Payment" : "Add Payment"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Payments Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">ID</th>
              <th className="border p-2">Party</th>
              <th className="border p-2">Invoice</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Method</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Reference</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.party?.name || "-"}</td>
                <td className="border p-2">{p.invoice?.id || "-"}</td>
                <td className="border p-2">{p.amount}</td>
                <td className="border p-2">{p.method}</td>
                <td className="border p-2">{p.payment_date}</td>
                <td className="border p-2">{p.reference || "-"}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
