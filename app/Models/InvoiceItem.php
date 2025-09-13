<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'invoice_id',
        'product_id',
        'description',
        'qty',
        'unit_price',
        'discount_percent',
        'tax_rate_id',
        'cgst_amt',
        'sgst_amt',
        'igst_amt',
        'line_total',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}


