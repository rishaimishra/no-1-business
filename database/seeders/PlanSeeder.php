<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanSeeder extends Seeder
{
    public function run()
    {
        DB::table('plans')->insert([
            ['code' => 'basic', 'name' => 'Basic', 'price_month' => 199, 'features_json' => json_encode(['users' => 1, 'whatsapp' => false])],
            ['code' => 'standard', 'name' => 'Standard', 'price_month' => 299, 'features_json' => json_encode(['users' => 3, 'whatsapp' => true])],
            ['code' => 'pro', 'name' => 'Pro', 'price_month' => 499, 'features_json' => json_encode(['users' => 5, 'whatsapp' => true])],
        ]);
    }
}