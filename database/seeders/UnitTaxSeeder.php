<?php

namespace Database\Seeders;

use App\Models\TaxRate;
use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitTaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Unit::create(['name' => 'Piece', 'symbol' => 'PC']);
        Unit::create(['name' => 'Kilogram', 'symbol' => 'KG']);

        TaxRate::create(['name' => 'GST 5%', 'rate' => 5.00]);
        TaxRate::create(['name' => 'GST 18%', 'rate' => 18.00]);

    }
}
