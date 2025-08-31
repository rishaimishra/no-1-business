<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartySeeder extends Seeder
{
    public function run()
    {
        $company = DB::table('companies')->first();
        DB::table('parties')->insert([
            ['company_id' => $company->id, 'type' => 'customer', 'name' => 'Ramesh Kumar', 'phone' => '919811111111', 'gstin' => null, 'state_code' => '10', 'opening_balance' => 0, 'credit_limit' => 5000, 'created_at' => now(), 'updated_at' => now()],
            ['company_id' => $company->id, 'type' => 'supplier', 'name' => 'Sharma Wholesalers', 'phone' => '919822222222', 'gstin' => '10XYZAB1234F1Z5', 'state_code' => '10', 'opening_balance' => 0, 'credit_limit' => 0, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}