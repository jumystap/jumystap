<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlockedUserLogout
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->is_blocked) {
            Auth::logout();

            return redirect()
                ->route('login')
                ->withErrors(['email' => __('messages.errors.account_is_blocked')]);
        }

        return $next($request);
    }
}

