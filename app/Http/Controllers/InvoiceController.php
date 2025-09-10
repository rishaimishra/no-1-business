<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Invoice;
use App\Models\Party;
use App\Models\Product;
use App\Models\StockMovement;
use App\Support\Gst;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    /**
     * GET /api/invoices
     * सभी invoices की list
     */
    public function index()
    {
        $company = app('company') ?? auth()->user()->company;

        $invoices = Invoice::with('party')
            ->where('company_id', $company->id)
            ->latest()
            ->paginate(10);

        return response()->json($invoices);
    }

    /**
     * POST /api/invoices
     * नया invoice create
     */
    public function store(StoreInvoiceRequest $req)
    {
        $invoice = null;

        DB::transaction(function () use ($req, &$invoice) {
            $company = app('company') ?? auth()->user()->company;
            $party = Party::findOrFail($req->party_id);

            $invoice = Invoice::create([
                'company_id' => $company->id,
                'invoice_no' => Invoice::nextNumber($company->id),
                'date' => $req->date,
                'party_id' => $party->id,
                'place_of_supply_state' => $party->state_code ?? $company->state_code,
                'status' => 'issued',
                'payment_status' => 'unpaid'
            ]);

            $subtotal = $tax_total = 0;

            foreach ($req->items as $row) {
                $product = Product::findOrFail($row['product_id']);
                $line_base = round($row['qty'] * $row['unit_price'] * (1 - ($row['discount_percent'] ?? 0) / 100), 2);
                $gstParts = Gst::split($line_base, $product->taxRate->igst, $company->state_code, $invoice->place_of_supply_state);

                $item = $invoice->items()->create([
                    'product_id' => $product->id,
                    'description' => $row['desc'] ?? $product->name,
                    'qty' => $row['qty'],
                    'unit_price' => $row['unit_price'],
                    'discount_percent' => $row['discount_percent'] ?? 0,
                    'tax_rate_id' => $product->tax_rate_id,
                    'cgst_amt' => $gstParts['cgst'],
                    'sgst_amt' => $gstParts['sgst'],
                    'igst_amt' => $gstParts['igst'],
                    'line_total' => $line_base + $gstParts['tax']
                ]);

                $subtotal += $line_base;
                $tax_total += $gstParts['tax'];

                StockMovement::create([
                    'company_id' => $company->id,
                    'product_id' => $product->id,
                    'type' => 'sale',
                    'qty_change' => -$row['qty'],
                    'ref_type' => 'invoice',
                    'ref_id' => $invoice->id
                ]);
            }

            $invoice->update([
                'subtotal' => $subtotal,
                'tax_total' => $tax_total,
                'grand_total' => round($subtotal + $tax_total, 2)
            ]);
        });

        return response()->json($invoice->load('items', 'party'), 201);
    }

    /**
     * GET /api/invoices/{id}
     * single invoice details
     */
    public function show(Invoice $invoice)
    {
        $this->authorizeCompany($invoice);

        return response()->json($invoice->load('items.product', 'party'));
    }

    /**
     * PUT /api/invoices/{id}
     * invoice update
     */
    public function update(UpdateInvoiceRequest $req, Invoice $invoice)
    {
        $this->authorizeCompany($invoice);

        DB::transaction(function () use ($req, $invoice) {
            $company = app('company') ?? auth()->user()->company;
            $party = Party::findOrFail($req->party_id);

            // पहले पुराने items और stock movements हटा दें
            $invoice->items()->delete();
            StockMovement::where('ref_type', 'invoice')->where('ref_id', $invoice->id)->delete();

            $invoice->update([
                'date' => $req->date,
                'party_id' => $party->id,
                'place_of_supply_state' => $party->state_code ?? $company->state_code,
            ]);

            $subtotal = $tax_total = 0;

            foreach ($req->items as $row) {
                $product = Product::findOrFail($row['product_id']);
                $line_base = round($row['qty'] * $row['unit_price'] * (1 - ($row['discount_percent'] ?? 0) / 100), 2);
                $gstParts = Gst::split($line_base, $product->taxRate->igst, $company->state_code, $invoice->place_of_supply_state);

                $invoice->items()->create([
                    'product_id' => $product->id,
                    'description' => $row['desc'] ?? $product->name,
                    'qty' => $row['qty'],
                    'unit_price' => $row['unit_price'],
                    'discount_percent' => $row['discount_percent'] ?? 0,
                    'tax_rate_id' => $product->tax_rate_id,
                    'cgst_amt' => $gstParts['cgst'],
                    'sgst_amt' => $gstParts['sgst'],
                    'igst_amt' => $gstParts['igst'],
                    'line_total' => $line_base + $gstParts['tax']
                ]);

                $subtotal += $line_base;
                $tax_total += $gstParts['tax'];

                StockMovement::create([
                    'company_id' => $company->id,
                    'product_id' => $product->id,
                    'type' => 'sale',
                    'qty_change' => -$row['qty'],
                    'ref_type' => 'invoice',
                    'ref_id' => $invoice->id
                ]);
            }

            $invoice->update([
                'subtotal' => $subtotal,
                'tax_total' => $tax_total,
                'grand_total' => round($subtotal + $tax_total, 2)
            ]);
        });

        return response()->json($invoice->load('items', 'party'));
    }

    /**
     * DELETE /api/invoices/{id}
     * invoice delete
     */
    public function destroy(Invoice $invoice)
    {
        $this->authorizeCompany($invoice);

        DB::transaction(function () use ($invoice) {
            $invoice->items()->delete();
            StockMovement::where('ref_type', 'invoice')->where('ref_id', $invoice->id)->delete();
            $invoice->delete();
        });

        return response()->json(['message' => 'Invoice deleted']);
    }

    /**
     * Helper - check company scope
     */
    protected function authorizeCompany(Invoice $invoice)
    {
        $company = app('company') ?? auth()->user()->company;

        if ($invoice->company_id !== $company->id) {
            abort(403, 'Unauthorized');
        }
    }
}
