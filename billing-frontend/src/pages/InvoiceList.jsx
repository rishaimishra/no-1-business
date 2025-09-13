import React, { useEffect, useState } from "react";
import API from "../api";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);

  const fetchInvoices = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.get(`/invoices?page=${page}`);
      setInvoices(res.data.data);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleConfirm = async (id) => {
    if (!window.confirm("Are you sure you want to confirm this invoice?")) return;
    setConfirming(id);
    try {
      await API.post(`/invoices/${id}/confirm`);
      await fetchInvoices(pagination.current_page); // refresh list
    } catch (err) {
      console.error(err);
      alert("Error confirming invoice!");
    } finally {
      setConfirming(null);
    }
  };

  const renderPagination = () => {
    if (!pagination.last_page || pagination.last_page === 1) return null;

    let pages = [];
    for (let i = 1; i <= pagination.last_page; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => fetchInvoices(pagination.current_page - 1)}
          className={`px-3 py-1 rounded-lg ${
            pagination.current_page === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => fetchInvoices(page)}
            className={`px-3 py-1 rounded-lg ${
              page === pagination.current_page
                ? "bg-blue-600 text-white font-bold"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={pagination.current_page === pagination.last_page}
          onClick={() => fetchInvoices(pagination.current_page + 1)}
          className={`px-3 py-1 rounded-lg ${
            pagination.current_page === pagination.last_page
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

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
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Invoice No</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Party</th>
                  <th className="px-4 py-2">Grand Total</th>
                  <th className="px-4 py-2">Payment Status</th>
                  <th className="px-4 py-2">Invoice Status</th>
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
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          inv.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {inv.status}
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
                      {inv.status === "draft" && (
                        <button
                          onClick={() => handleConfirm(inv.id)}
                          disabled={confirming === inv.id}
                          className="text-green-600 hover:underline"
                        >
                          {confirming === inv.id
                            ? "Confirming..."
                            : "Confirm"}
                        </button>
                      )}
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
          {renderPagination()}
        </>
      )}
    </div>
  );
}
