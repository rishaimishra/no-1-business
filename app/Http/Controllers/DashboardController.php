<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\TaxRate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $companyId = auth()->user()->company_id;

        // Payments summary (daily, weekly, monthly)
        $dailyPayments = Payment::where('company_id', $companyId)
            ->whereDate('created_at', today())
            ->sum('amount');

        $weeklyPayments = Payment::where('company_id', $companyId)
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('amount');

        $monthlyPayments = Payment::where('company_id', $companyId)
            ->whereMonth('created_at', now()->month)
            ->sum('amount');

        // Invoices count (draft, sent, paid)
        $invoiceStats = Invoice::select('status', DB::raw('count(*) as total'))
            ->where('company_id', $companyId)
            ->groupBy('status')
            ->pluck('total', 'status');

        // Tax Rate usage
        $taxUsage = TaxRate::withCount(['products' => function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        }])->get();

        // Payments trend (last 7 days)
        $paymentsTrend = Payment::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(amount) as total')
        )
            ->where('company_id', $companyId)
            ->whereBetween('created_at', [now()->subDays(6), now()])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'payments' => [
                'daily' => $dailyPayments,
                'weekly' => $weeklyPayments,
                'monthly' => $monthlyPayments,
                'trend' => $paymentsTrend,
            ],
            'invoices' => $invoiceStats,
            'taxRates' => $taxUsage,
        ]);
    }
}
