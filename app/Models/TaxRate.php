<?php

namespace App\Models;

use App\Models\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaxRate extends Model
{
    use HasFactory, BelongsToCompany;
    protected $table = 'tax_rates';

    protected $fillable = ['company_id', 'name', 'rate'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}

