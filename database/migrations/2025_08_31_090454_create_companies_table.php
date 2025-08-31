<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id(); // This creates a BIGINT UNSIGNED column
            $table->string('name');
            $table->string('subdomain')->unique();
            $table->string('gstin')->nullable();
            $table->string('state_code', 2)->nullable();
            $table->text('address')->nullable();
            $table->foreignId('owner_id')->nullable()->constrained('users');
            $table->string('billing_email')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->foreignId('plan_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
