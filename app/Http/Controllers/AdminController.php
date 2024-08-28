<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Certificate;
use App\Models\Profession\Profession;
use App\Models\User;
use App\Services\AnalyticsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index(): mixed
    {
        $statistics = $this->analyticsService->getDashboardStatistics();

        return Inertia::render('Admin/AdminDashboard', [
            'statistics' => $statistics
        ]);
    }

    public function login(): mixed
    {
        return Inertia::render('Admin/AdminLogin');
    }

    public function auth(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        if(Auth::attempt($credentials))
        {
            if(Auth::user()->role->name == 'admin')
            {
                return redirect('/admin');
            }
        }

        return redirect('/admin/login');
    }

    public function employers(): mixed
    {
        $employers = User::getUsersByRoleName('employer')->get();
        return Inertia::render('Admin/AdminEmployers', [
            'employers' => $employers,
        ]);
    }

    public function employees(): mixed
    {
        $employees = User::getUsersByRoleName('employee')->get();
        return Inertia::render('Admin/AdminEmployees', [
            'employees' => $employees,
        ]);
    }

    public function componies(): mixed
    {
        $companies = User::getUsersByRoleName('company')->get();
        return Inertia::render('Admin/AdminComponies', [
            'companies' => $companies,
        ]);
    }

    public function announcements(): mixed
    {
        $announcements = Announcement::all();
        return Inertia::render('Admin/AdminAnnouncements', [
            'announcements' => $announcements,
        ]);
    }

    public function professions(): mixed
    {
        $professions = Profession::all();
        return Inertia::render('Admin/AdminProfessions', [
            'professions' => $professions,
        ]);
    }

    public function certificates(): mixed
    {
        $professions = Profession::all();
        $certificates = Certificate::with('profession')->get();

        return Inertia::render('Admin/AdminCertificates', [
            "professions" => $professions,
            "certificates" => $certificates
        ]);
    }

    public function logout(): RedirectResponse
    {
        Auth::logout();
        return redirect('/admin/login');
    }
}
