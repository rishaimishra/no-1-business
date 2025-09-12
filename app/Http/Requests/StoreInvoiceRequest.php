<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'party_id' => 'required|exists:parties,id',
            'date' => 'required|date',
            'items' => 'required|array|min:1',

            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|numeric|min:0.001',
            'items.*.unit_price' => 'required|numeric|min:0',

            // optional fields
            'items.*.discount_percent' => 'nullable|numeric|min:0|max:100',
            'items.*.desc' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'party_id.required' => 'Party is required.',
            'items.required' => 'At least one item is required.',
            'items.*.product_id.exists' => 'Invalid product selected.',
            'items.*.qty.min' => 'Quantity must be greater than zero.',
        ];
    }
}
