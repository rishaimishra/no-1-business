<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'party_id',
        'invoice_no',
        'date',
        'place_of_supply_state',
        'subtotal',
        'tax_total',
        'grand_total',
        'status',
        'payment_status',
        'pdf_path',
    ];

    /**
     * Generate next invoice number for a company
     */

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    /**
     * Invoice ki party
     */
    public function party()
    {
        return $this->belongsTo(Party::class);
    }
    public static function nextNumber($companyId): string
    {
        $last = self::where('company_id', $companyId)
            ->orderByDesc('id')
            ->first();

        if (!$last || !$last->invoice_no) {
            return "INV-0001";
        }

        $lastNumber = intval(preg_replace('/[^0-9]/', '', $last->invoice_no));
        $newNumber = $lastNumber + 1;

        return "INV-" . str_pad($newNumber, 4, "0", STR_PAD_LEFT);
    }
}
