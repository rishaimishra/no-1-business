<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\Auth;

trait BelongsToCompany
{
    /**
     * The "booting" method of the trait.
     * This is automatically called by Laravel when the model is booted.
     * It's the perfect place to register model events or global scopes.
     */
    protected static function bootBelongsToCompany()
    {
        // Add a global scope to automatically filter queries by the company.
        // This ensures that any query on a model using this trait will
        // only retrieve records belonging to the current company.
        static::addGlobalScope('company', function ($query) {
            // Check if a company ID is available from the 'company' singleton
            // or from the currently authenticated user.
            if ($company = app('company') ?? Auth::user()?->company) {
                // Apply the 'where' clause to filter by the company ID.
                $query->where($query->getModel()->getTable() . '.company_id', $company->id);
            }
        });

        // Register a 'creating' event listener.
        // This ensures that the company_id is set before the record is saved to the database
        // for the very first time.
        static::creating(function ($model) {
            // Only set the company_id if it's not already set on the model.
            if (empty($model->company_id)) {
                // Get the company ID from the 'company' singleton or the authenticated user.
                $model->company_id = app('company')?->id ?? Auth::user()?->company_id;
            }
        });
    }
}
