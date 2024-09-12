<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\User;

class AuthController extends Controller
{
    public function forgetPassword(): mixed
    {
        return Inertia::render("ForgotPassword");
    }

    public function restorePassword(Request $request): mixed
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return redirect()->back()->withErrors(['phone' => 'Phone number not found']);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user);

        return redirect('/profile');
    }
}
