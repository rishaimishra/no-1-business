<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    public function run()
    {
        $companyId = DB::table('companies')->insertGetId([
            'name' => 'Demo Store',
            'subdomain' => 'demo',
            'gstin' => '10ABCDE1234F1Z5',
            'state_code' => '10',
            'billing_email' => 'demo@example.com',
            'whatsapp_number' => '919876543210',
            'plan_id' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);


        DB::table('users')->insert([
            'company_id' => $companyId,
            'name' => 'Owner',
            'email' => 'owner@demo.com',
            'phone' => '919999999999',
            'password' => bcrypt('password'),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}