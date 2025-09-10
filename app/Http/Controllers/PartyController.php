<?php

namespace App\Http\Controllers;

use App\Models\Party;
use Illuminate\Http\Request;

class PartyController extends Controller
{
    public function index()
    {
        $company = app('company') ?? auth()->user()->company;

        $parties = Party::where('company_id', $company->id)
            ->latest()
            ->paginate(10);

        return response()->json($parties);
    }

    public function store(Request $request)
    {
        $company = app('company') ?? auth()->user()->company;

        $data = $request->validate([
            'type' => 'required|in:customer,supplier',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'gstin' => 'nullable|string|max:15',
            'state_code' => 'nullable|string|max:2',
            'billing_address' => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'opening_balance' => 'nullable|numeric',
            'credit_limit' => 'nullable|numeric',
        ]);

        $party = Party::create(array_merge($data, [
            'company_id' => $company->id,
        ]));

        return response()->json($party, 201);
    }

    public function show(Party $party)
    {
        $this->authorizeCompany($party);

        return response()->json($party->load('invoices', 'payments'));
    }

    public function update(Request $request, Party $party)
    {
        $this->authorizeCompany($party);

        $data = $request->validate([
            'type' => 'required|in:customer,supplier',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'gstin' => 'nullable|string|max:15',
            'state_code' => 'nullable|string|max:2',
            'billing_address' => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'opening_balance' => 'nullable|numeric',
            'credit_limit' => 'nullable|numeric',
        ]);

        $party->update($data);

        return response()->json($party);
    }

    public function destroy(Party $party)
    {
        $this->authorizeCompany($party);

        $party->delete();

        return response()->json(['message' => 'Party deleted']);
    }

    protected function authorizeCompany(Party $party)
    {
        $company = app('company') ?? auth()->user()->company;

        if ($party->company_id !== $company->id) {
            abort(403, 'Unauthorized');
        }
    }
}
