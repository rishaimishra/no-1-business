import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function InvoiceCreate() {
    const navigate = useNavigate();

    const [parties, setParties] = useState([]);
    const [taxrates, settaxrates] = useState([]);
    const [products, setProducts] = useState([]);
    const [invoiceDate, setInvoiceDate] = useState("");
    const [partyId, setPartyId] = useState("");
    const [items, setItems] = useState([{ product_id: "", qty: 1, unit_price: 0, discount_percent: 0 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // fetch parties & products
    // fetch parties, products, taxrates
    useEffect(() => {
        const fetchData = async () => {
            try {
                const partyRes = await API.get("/parties");
                setParties(partyRes.data.data);

                const productRes = await API.get("/products");
                setProducts(productRes.data);

                const taxRateRes = await API.get("/tax-rates");
                settaxrates(taxRateRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);


    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const addItem = () => {
        setItems([...items, { product_id: "", qty: 1, unit_price: 0, discount_percent: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await API.post("/invoices", {
                date: invoiceDate,
                party_id: partyId,
                items,
            });

            navigate("/invoices"); // redirect back to list
        } catch (err) {
            console.error(err);
            setError("Failed to create invoice. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">New Invoice</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Invoice Date */}
                <div>
                    <label className="block text-sm font-medium mb-1">Invoice Date</label>
                    <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </div>

                {/* Party */}
                <div>
                    <label className="block text-sm font-medium mb-1">Party</label>
                    <select
                        value={partyId}
                        onChange={(e) => setPartyId(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                    >
                        <option value="">-- Select Party --</option>
                        {parties.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Invoice Items */}
                <div>
                    <h2 className="text-lg font-medium mb-2">Items</h2>
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-6 gap-2 mb-2 items-center">
                            {/* Product */}
                            <select
                                value={item.product_id}
                                onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                                required
                                className="border border-gray-300 rounded-lg p-2"
                            >
                                <option value="">Select Product</option>
                                {products.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.name}
                                    </option>
                                ))}
                            </select>

                            {/* Qty */}
                            <input
                                type="number"
                                value={item.qty}
                                onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                                placeholder="Qty"
                                className="border border-gray-300 rounded-lg p-2"
                            />

                            {/* Unit Price */}
                            <input
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                                placeholder="Unit Price"
                                className="border border-gray-300 rounded-lg p-2"
                            />

                            {/* Discount */}
                            <input
                                type="number"
                                value={item.discount_percent}
                                onChange={(e) => handleItemChange(index, "discount_percent", e.target.value)}
                                placeholder="Discount %"
                                className="border border-gray-300 rounded-lg p-2"
                            />

                            {/* GST */}
                            <select
                                value={item.tax_rate_id || ""}
                                onChange={(e) => handleItemChange(index, "tax_rate_id", e.target.value)}
                                required
                                className="border border-gray-300 rounded-lg p-2"
                            >
                                <option value="">Select GST</option>
                                {taxrates.map(rate => (
                                    <option key={rate.id} value={rate.id}>
                                        {rate.name} ({rate.rate}%)
                                    </option>
                                ))}
                            </select>

                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        + Add Item
                    </button>
                </div>


                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium transition ${loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Saving..." : "Save Invoice"}
                </button>
            </form>
        </div>
    );
}
