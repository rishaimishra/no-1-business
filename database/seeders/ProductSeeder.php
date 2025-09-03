<?php

namespace Database\Seeders;

use App\Models\TaxRate;
use App\Models\Unit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $company = DB::table('companies')->first();
        DB::table('products')->insert([
            ['company_id' => $company->id, 'name' => 'Milk Packet', 'sku' => 'MLK01', 'hsn_code' => '0401', 'unit_id' => 1, 'tax_rate_id' => 1, 'sale_price' => 30, 'purchase_price' => 25, 'opening_stock' => 100, 'min_stock' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['company_id' => $company->id, 'name' => 'Rice Bag 25kg', 'sku' => 'RC25', 'hsn_code' => '1006', 'unit_id' => 2, 'tax_rate_id' => 1, 'sale_price' => 1200, 'purchase_price' => 1000, 'opening_stock' => 20, 'min_stock' => 2, 'created_at' => now(), 'updated_at' => now()],
        ]);
        Unit::create(['name' => 'Piece', 'symbol' => 'PC']);
        Unit::create(['name' => 'Kilogram', 'symbol' => 'KG']);

        TaxRate::create(['name' => 'GST 5%', 'rate' => 5.00]);
        TaxRate::create(['name' => 'GST 18%', 'rate' => 18.00]);

    }
}