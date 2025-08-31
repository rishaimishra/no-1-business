<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Plan;
use App\Models\Subscription;
use Razorpay\Api\Api;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function create(Request $request, Plan $plan)
    {
        $company = app('company') ?? auth()->user()->company;
        
        $api = new Api(
            config('services.razorpay.key'), 
            config('services.razorpay.secret')
        );
        
        $subscription = $api->subscription->create([
            'plan_id' => $plan->razorpay_plan_id,
            'customer_notify' => 1,
            'total_count' => 0, // ongoing subscription
            'notes' => ['company_id' => $company->id]
        ]);
        
        Subscription::create([
            'company_id' => $company->id,
            'plan_id' => $plan->id,
            'gateway' => 'razorpay',
            'status' => 'pending',
            'razorpay_subscription_id' => $subscription['id']
        ]);
        
        return redirect()->away($subscription['short_url']);
    }
    
    public function webhook(Request $request)
    {
        // Handle Razorpay webhook for subscription events
        $payload = $request->all();
        
        // Verify webhook signature
        // Update subscription status based on event
    }
}