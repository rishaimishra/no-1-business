<?php

namespace App\Models;

use App\Models\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
use BelongsToCompany;
protected $fillable = ['name','sku','unit_id','hsn_code','tax_rate_id','sale_price','purchase_price','opening_stock','min_stock'];
public function unit(){ return $this->belongsTo(Unit::class); }
public function taxRate(){ return $this->belongsTo(TaxRate::class); }
}
