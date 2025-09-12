import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/invoices"); 
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <a
          href="/invoices/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Invoice
        </a>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-500">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Invoice No</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Party</th>
                <th className="px-4 py-2">Grand Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{inv.invoice_no}</td>
                  <td className="px-4 py-2">{inv.date}</td>
                  <td className="px-4 py-2">{inv.party?.name}</td>
                  <td className="px-4 py-2">₹{inv.grand_total}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        inv.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : inv.payment_status === "partial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {inv.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <a
                      href={`/invoices/${inv.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                    <a
                      href={`/invoices/${inv.id}/edit`}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => console.log("delete", inv.id)}
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
