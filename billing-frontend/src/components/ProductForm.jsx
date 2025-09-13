import { useState, useEffect } from "react";
import API from "../api";

export default function ProductForm({ editingProduct, onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [unitId, setUnitId] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [taxRateId, setTaxRateId] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [units, setUnits] = useState([]);
  const [taxRates, setTaxRates] = useState([]);

  useEffect(() => {
    const fetchUnitsAndTaxes = async () => {
      try {
        const [unitsRes, taxRes] = await Promise.all([
          API.get("/units"),
          API.get("/tax-rates"),
        ]);
        setUnits(unitsRes.data);
        setTaxRates(taxRes.data);
      } catch (err) {
        console.error("Failed to fetch units/taxes", err);
      }
    };

    fetchUnitsAndTaxes();
  }, []);

  // populate fields in edit mode
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setSku(editingProduct.sku || "");
      setUnitId(editingProduct.unit_id || "");
      setHsnCode(editingProduct.hsn_code || "");
      setTaxRateId(editingProduct.tax_rate_id || "");
      setSalePrice(editingProduct.sale_price || "");
      setPurchasePrice(editingProduct.purchase_price || "");
      setOpeningStock(editingProduct.opening_stock || "");
      setMinStock(editingProduct.min_stock || "");
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, {
          name,
          sku,
          unit_id: unitId,
          hsn_code: hsnCode,
          tax_rate_id: taxRateId,
          sale_price: salePrice,
          purchase_price: purchasePrice,
          opening_stock: openingStock,
          min_stock: minStock,
        });
      } else {
        await API.post("/products", {
          name,
          sku,
          unit_id: unitId,
          hsn_code: hsnCode,
          tax_rate_id: taxRateId,
          sale_price: salePrice,
          purchase_price: purchasePrice,
          opening_stock: openingStock,
          min_stock: minStock,
        });
      }
      onSuccess(); // parent ko batao success hua
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
        <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
        <select value={unitId} onChange={(e) => setUnitId(e.target.value)} className="w-full border px-3 py-2 rounded-md">
          <option value="">Select Unit</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
        <input type="text" value={hsnCode} onChange={(e) => setHsnCode(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GST</label>
        <select value={taxRateId} onChange={(e) => setTaxRateId(e.target.value)} className="w-full border px-3 py-2 rounded-md">
          <option value="">Select GST</option>
          {taxRates.map((t) => (
            <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
        <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} required className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (₹)</label>
        <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Opening Stock</label>
        <input type="number" value={openingStock} onChange={(e) => setOpeningStock(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
        <input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div className="col-span-3 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
        {editingProduct && (
          <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
