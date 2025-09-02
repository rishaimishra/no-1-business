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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id');
            $table->string('invoice_no');
            $table->date('date');
            $table->foreignId('party_id');
            $table->string('place_of_supply_state', 2)->nullable();
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_total', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2)->default(0);
            $table->enum('status', ['draft', 'issued', 'cancelled']);
            $table->enum('payment_status', ['unpaid', 'partial', 'paid']);
            $table->string('pdf_path')->nullable();
            $table->timestamps();
            $table->unique(['company_id', 'invoice_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
