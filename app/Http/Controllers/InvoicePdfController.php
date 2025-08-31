<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InvoicePdfController extends Controller
{
    public function generate(Invoice $invoice)
    {
        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice])->setPaper('A4');
        $path = "invoices/{$invoice->id}.pdf";
        
        Storage::disk('public')->put($path, $pdf->output());
        $invoice->update(['pdf_path' => $path]);
        
        return response()->download(Storage::disk('public')->path($path));
    }
}
