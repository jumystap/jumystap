<?php

namespace App\Http\Middleware;

use App\Models\Visit;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Jenssegers\Agent\Agent;

class TrackVisits
{
    public function handle(Request $request, Closure $next)
    {
        $userId = Auth::check() ? Auth::id() : null;
        $agent = new Agent();
        $deviceType = $agent->isMobile() ? 'mobile' : 'desktop';

        Visit::create([
            'user_id' => $userId,
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'device_type' => $deviceType,
        ]);

//        TrackVisitJob::dispatch($user, $request->fullUrl(), $request->ip(), $deviceType);

        return $next($request);
    }
}

