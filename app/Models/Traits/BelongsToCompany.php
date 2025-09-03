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
            if ($user = Auth::user()) {
                $query->where($query->getModel()->getTable() . '.company_id', $user->company_id);
            }
        });

        static::creating(function ($model) {
            if (empty($model->company_id) && Auth::user()) {
                $model->company_id = Auth::user()->company_id;
            }
        });

    }
}
