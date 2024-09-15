<?php

namespace App\Http\Middleware;

use App\Jobs\TrackVisitJob;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TrackVisits
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::check() ? Auth::id() : 1;
        $agent = new \Jenssegers\Agent\Agent();
        $deviceType = $agent->isMobile() ? 'mobile' : 'desktop';

        TrackVisitJob::dispatch($user, $request->fullUrl(), $request->ip(), $deviceType);

        return $next($request);
    }
}

