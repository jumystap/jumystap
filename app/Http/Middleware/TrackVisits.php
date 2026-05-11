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
        $url = $request->fullUrl();
        $ip = $request->ip();

        $response = $next($request);

        app()->terminating(function () use ($userId, $url, $ip, $deviceType) {
            try {
                Visit::create([
                    'user_id' => $userId,
                    'url' => $url,
                    'ip_address' => $ip,
                    'device_type' => $deviceType,
                ]);
            } catch (\Throwable $e) {
                report($e);
            }
        });

//        TrackVisitJob::dispatch($user, $request->fullUrl(), $request->ip(), $deviceType);

        return $response;
    }
}
