<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with(['party', 'invoice'])->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'party_id' => 'required|exists:parties,id',
            'invoice_id' => 'nullable|exists:invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'method' => 'nullable|string',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $data['company_id'] = auth()->user()->company_id;

        $payment = Payment::create($data);

        return response()->json($payment->load(['party', 'invoice']), 201);
    }

    public function show(Payment $payment)
    {
        return $payment->load(['party', 'invoice']);
    }

    public function update(Request $request, Payment $payment)
    {
        $data = $request->validate([
            'amount' => 'sometimes|numeric|min:0.01',
            'method' => 'nullable|string',
            'payment_date' => 'sometimes|date',
            'notes' => 'nullable|string',
        ]);

        $payment->update($data);

        return response()->json($payment->fresh()->load(['party', 'invoice']));
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(null, 204);
    }
}
