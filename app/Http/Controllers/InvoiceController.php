<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Party;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\TaxRate;
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
        $company = auth()->user()->company;

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
    public function store(StoreInvoiceRequest $request)
    {
        $company = auth()->user()->company;

        return DB::transaction(function () use ($request, $company) {
            $subtotal = 0;
            $taxTotal = 0;
            $grandTotal = 0;

            // invoice create (empty totals for now)
            $invoice = Invoice::create([
                'company_id' => $company->id,
                'party_id' => $request->party_id,
                'date' => $request->date,
                'invoice_no' => Invoice::nextNumber($company->id),
                'place_of_supply_state' => $request->place_of_supply_state,
                'subtotal' => 0,
                'tax_total' => 0,
                'grand_total' => 0,
                'status' => 'draft',
                'payment_status' => 'unpaid',
            ]);

            foreach ($request->items as $item) {
                $lineSubtotal = $item['qty'] * $item['unit_price'];

                // discount
                $discount = ($item['discount_percent'] ?? 0) / 100 * $lineSubtotal;
                $lineSubtotal -= $discount;

                // --- GST logic ---
                $cgst = 0;
                $sgst = 0;
                $igst = 0;

                // agar place_of_supply_state == company_state → CGST+SGST
                if ($request->place_of_supply_state == $company->state_code) {
                    $cgst = ($item['tax_percent'] ?? 0) / 2 / 100 * $lineSubtotal;
                    $sgst = ($item['tax_percent'] ?? 0) / 2 / 100 * $lineSubtotal;
                } else {
                    $igst = ($item['tax_percent'] ?? 0) / 100 * $lineSubtotal;
                }

                $lineTotal = $lineSubtotal + $cgst + $sgst + $igst;

                // totals update
                $subtotal += $lineSubtotal;
                $taxTotal += ($cgst + $sgst + $igst);
                $grandTotal += $lineTotal;
                $taxRate = TaxRate::find((int) $item['tax_rate_id']);


                if (!$taxRate) {
                    return response()->json(['error' => 'Invalid Tax Rate selected.'], 422);
                }
                
                $taxPercent = $taxRate->rate;

                // save item
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $item['product_id'],
                    'description' => $item['description'] ?? null,
                    'qty' => $item['qty'],
                    'unit_price' => $item['unit_price'],
                    'discount_percent' => $item['discount_percent'] ?? 0,
                    'tax_rate_id' => $item['tax_rate_id'] ?? null,
                    'cgst_amt' => $cgst,
                    'sgst_amt' => $sgst,
                    'igst_amt' => $igst,
                    'line_total' => $lineTotal,
                ]);
            }

            // update invoice totals
            $invoice->update([
                'subtotal' => $subtotal,
                'tax_total' => $taxTotal,
                'grand_total' => $grandTotal,
            ]);

            return response()->json($invoice->load('items'), 201);
        });
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
        $company = auth()->user()->company;

        if ($invoice->company_id !== $company->id) {
            abort(403, 'Unauthorized');
        }
    }

}
