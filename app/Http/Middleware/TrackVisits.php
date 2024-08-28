<?php

namespace App\Http\Middleware;

use App\Models\Visit;
use Closure;
use Illuminate\Http\Request;
use Jenssegers\Agent\Agent;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TrackVisits
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = null;
        if (Auth::check()) {
            $user = Auth::id();
        }else{
            $user = 1;
        }

        $agent = new Agent();
        $deviceType = $agent->isMobile() ? 'mobile' : 'desktop';
        Visit::create([
            'user_id' => $user,
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'device_type' => $deviceType,
        ]);
        return $next($request);
    }
}
