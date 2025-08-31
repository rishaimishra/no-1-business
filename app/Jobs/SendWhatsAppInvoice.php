<?php

namespace App\Jobs;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class SendWhatsAppInvoice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Invoice $invoice,
        public string $phone
    ) {}

    public function handle(): void
    {
        $url = config('services.whatsapp.api');
        $token = config('services.whatsapp.token');
        
        Http::withToken($token)->post($url.'/messages', [
            'messaging_product' => 'whatsapp',
            'to' => $this->phone,
            'type' => 'template',
            'template' => [
                'name' => 'invoice_share',
                'language' => ['code' => 'hi'],
                'components' => [[
                    'type' => 'header',
                    'parameters' => [[
                        'type' => 'document',
                        'document' => [
                            'link' => Storage::disk('public')->url($this->invoice->pdf_path),
                            'filename' => "Invoice-{$this->invoice->invoice_no}.pdf"
                        ]
                    ]]
                ]]
            ]
        ]);
    }
}