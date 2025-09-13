<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function index()
    {
        // Authenticated user की company_id के हिसाब से लाएँ
        return Unit::where('company_id', auth()->user()->company_id)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'symbol' => 'required|string|max:50',
        ]);

        $unit = Unit::create([
            'company_id' => auth()->user()->company_id,
            'name'       => $request->name,
            'symbol'     => $request->symbol,
        ]);

        return response()->json($unit, 201);
    }

    public function show(Unit $unit)
    {
        $this->authorizeUnit($unit);

        return $unit;
    }

    public function update(Request $request, Unit $unit)
    {
        $this->authorizeUnit($unit);

        $request->validate([
            'name'   => 'required|string|max:255',
            'symbol' => 'required|string|max:50',
        ]);

        $unit->update($request->only('name', 'symbol'));

        return $unit;
    }

    public function destroy(Unit $unit)
    {
        $this->authorizeUnit($unit);

        $unit->delete();
        return response()->json(['message' => 'Unit deleted']);
    }

    private function authorizeUnit(Unit $unit)
    {
        if ($unit->company_id !== auth()->user()->company_id) {
            abort(403, 'Unauthorized action.');
        }
    }
}
