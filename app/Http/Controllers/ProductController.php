<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        // Relations bhi return karenge (unit + taxRate)
        return Product::with(['unit', 'taxRate'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'sku'            => 'nullable|string|max:100',
            'unit_id'        => 'required|exists:units,id',
            'hsn_code'       => 'nullable|string|max:50',
            'tax_rate_id'    => 'nullable|exists:tax_rates,id',
            'sale_price'     => 'required|numeric|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'opening_stock'  => 'nullable|numeric|min:0',
            'min_stock'      => 'nullable|numeric|min:0',
        ]);

        $product = Product::create([
            'name'           => $request->name,
            'sku'            => $request->sku,
            'unit_id'        => $request->unit_id,
            'hsn_code'       => $request->hsn_code,
            'tax_rate_id'    => $request->tax_rate_id,
            'sale_price'     => $request->sale_price,
            'purchase_price' => $request->purchase_price,
            'opening_stock'  => $request->opening_stock,
            'min_stock'      => $request->min_stock,
            'company_id'     => auth()->user()->company_id, // multi-tenancy ke liye
        ]);

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product->load(['unit', 'taxRate']);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'sku'            => 'nullable|string|max:100',
            'unit_id'        => 'sometimes|required|exists:units,id',
            'hsn_code'       => 'nullable|string|max:50',
            'tax_rate_id'    => 'nullable|exists:tax_rates,id',
            'sale_price'     => 'sometimes|required|numeric|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'opening_stock'  => 'nullable|numeric|min:0',
            'min_stock'      => 'nullable|numeric|min:0',
        ]);

        $product->update($request->all());

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
