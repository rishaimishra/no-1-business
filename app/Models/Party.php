<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;

class Party extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id', 'type', 'name', 'phone', 'gstin', 'state_code',
        'billing_address', 'shipping_address', 'opening_balance', 'credit_limit'
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'credit_limit' => 'decimal:2',
    ];

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function getBalanceAttribute(): float
    {
        $invoiceTotal = $this->invoices()->sum('grand_total');
        $paymentTotal = $this->payments()->sum('amount');
        return $invoiceTotal - $paymentTotal + $this->opening_balance;
    }
}