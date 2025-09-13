<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PartyController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UnitController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ProductController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/tax-rates', function () {
    return \App\Models\TaxRate::all();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('products', ProductController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('parties', PartyController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('units', UnitController::class);




});

