<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveCompany
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost(); // shop.sub.domain.com
        $sub = explode('.', $host)[0];

        $excludedSubdomains = ['www', 'app', 'localhost', '127', '0', '::1'];

        if ($sub && !in_array($sub, $excludedSubdomains)) {
            $company = Company::where('subdomain', $sub)->first();

            if ($company) {
                app()->instance('company', $company);
            }
        }

        return $next($request);
    }
}
