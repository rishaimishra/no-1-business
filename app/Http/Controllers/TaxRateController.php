<?php

namespace App\Http\Controllers;

use App\Models\TaxRate;
use Illuminate\Http\Request;

class TaxRateController extends Controller
{
    public function index()
    {
        // Authenticated user की company_id के हिसाब से tax rates लाएँ
        return TaxRate::where('company_id', auth()->user()->company_id)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0|max:100',
        ]);

        $taxRate = TaxRate::create([
            'company_id' => auth()->user()->company_id,
            'name'       => $request->name,
            'rate'       => $request->rate,
        ]);

        return response()->json($taxRate, 201);
    }

    public function show(TaxRate $taxRate)
    {
        $this->authorizeTaxRate($taxRate);

        return $taxRate;
    }

    public function update(Request $request, TaxRate $taxRate)
    {
        $this->authorizeTaxRate($taxRate);

        $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0|max:100',
        ]);

        $taxRate->update($request->only('name', 'rate'));

        return $taxRate;
    }

    public function destroy(TaxRate $taxRate)
    {
        $this->authorizeTaxRate($taxRate);

        $taxRate->delete();

        return response()->json(['message' => 'Tax Rate deleted']);
    }

    private function authorizeTaxRate(TaxRate $taxRate)
    {
        if ($taxRate->company_id !== auth()->user()->company_id) {
            abort(403, 'Unauthorized action.');
        }
    }
}
