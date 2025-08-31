<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Barryvdh\DomPDF\PDF;
use Illuminate\Http\Request;

class InvoicePdfController extends Controller
{
    public function generate(Invoice $invoice)
    {
        $pdf = PDF::loadView('pdf.invoice', ['invoice' => $invoice])->setPaper('A4');
        $path = "invoices/{$invoice->id}.pdf";
        
        Storage::disk('public')->put($path, $pdf->output());
        $invoice->update(['pdf_path' => $path]);
        
        return response()->download(Storage::disk('public')->path($path));
    }
}
