<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Visit;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;
use Illuminate\Support\Facades\DB;
use App\Models\Response;
use App\Models\User;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(): mixed
    {
        $employees = $this->userService->getEmployees();
        $professions = $this->userService->getAllProfessions();

        return Inertia::render('Employees', [
            'employees' => $employees,
            'professions' => $professions
        ]);
    }

    public function login(): mixed
    {
        if (Auth::check()) {
            return redirect('/');
        }
        return Inertia::render('Login');
    }

    public function auth(Request $request): SymfonyRedirectResponse
    {
        $credentials = $request->validate([
            'phone' => 'required',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            return redirect('/profile');
        } else {
            return redirect()->back()->withErrors(['error' => 'Неверный логин или пароль. Пожалуйста, попробуйте снова'])->withInput();
        }
    }

    public function register(): mixed
    {
        $professions = $this->userService->getAllProfessions();

        return Inertia::render('Registration', [
            'professions' => $professions,
        ]);
    }

    public function store(Request $request): SymfonyRedirectResponse
    {
        Log::info('Store user request received', $request->all());

        $validated = $request->validate([
            'phone' => 'required|string',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string',
            'role' => 'required',
            'date_of_birth' => 'nullable',
            'gender' => 'nullable',
            'description' => 'nullable|string',
            'source' => 'nullable|string',
        ]);

        try {
            $user = $this->userService->storeUser($validated);
            Auth::login($user);

            return redirect('/profile');
        } catch (\Exception $e) {
            Log::error('Error creating user', ['exception' => $e]);
            return redirect()->back()->withErrors(['error' => 'An error occurred while creating the user'])->withInput();
        }
    }

    public function updateCertificate(): mixed
    {
        $user = User::where('id', Auth::id())->first();
        $validatedData = ['phone' => $user->phone];

        if($this->userService->getCertificates($validatedData, $user)){
            $user->update(['is_graduate' => 1]);
            return redirect('/profile');
        } else {
            $user->update(['is_graduate' => 0]);
            return redirect('/profile');
        }

        return 0;
    }

    public function edit(): mixed
    {
        $user = Auth::user()->load('role');
        $professions = $this->userService->getAllProfessions();
        $userProfessions = $this->userService->getUserProfessions($user->id);

        return Inertia::render('UpdateUser', [
            'user' => $user,
            'userProfessions' => $userProfessions,
            'professions' => $professions,
        ]);
    }

    public function update(Request $request): SymfonyRedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'phone' => 'required|string',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'nullable|string',
            'avatar' => 'nullable|file|max:2048',
            'ipStatus1' => 'nullable|string',
            'ipStatus2' => 'nullable|string',
            'ipStatus3' => 'nullable|string',
            'description' => 'nullable|string',
            'age' => 'nullable',
            'date_of_birth' => 'nullable'
        ]);

        try {
            if (!empty($validated['ipStatus1'])) {
                $statuses = $this->userService->determineUserStatuses($validated);
                $validated = array_merge($validated, $statuses);
            }

            $this->userService->updateUser($user, $validated);

            return redirect('/profile');
        } catch (\Exception $e) {
            Log::error('Error updating user', ['exception' => $e]);
            return redirect()->back()->withErrors(['error' => 'An error occurred while updating the user'])->withInput();
        }
    }

    public function show($id): mixed
    {
        $user = $this->userService->getUserWithProfessionsAndPortfolio($id);
        $userProfessions = $this->userService->getUserProfessions($id);

        $employeeProfessionIds = $this->userService->getUserProfessionIds($id);
        $employees = $this->userService->getUsersByProfessionIds($employeeProfessionIds);

        return Inertia::render('User', [
            'user' => $user,
            'employees' => $employees,
            'userProfessions' => $userProfessions,
        ]);
    }

    public function profile(): mixed
    {
        $user = Auth::user()->load(['role', 'portfolio', 'announcement']);
        $userProfessions = $this->userService->getUserProfessions($user->id);

        foreach ($user->announcement as $announcement) {
            $announcement->visit_count = DB::table('visits')
                ->where('url', "https://jumystap.kz/announcement/{$announcement->id}")
                ->count();
        }

        $announcements = $this->userService->getLatestAnnouncements(true);
        $professions = $this->userService->getAllProfessions();

        return Inertia::render('Profile', [
            'user' => $user,
            'announcements' => $announcements,
            'employees' => $user,
            'professions' => $professions,
            'userProfessions' => $userProfessions,
        ]);
    }

    public function myAnnouncement($id)
    {
        $announcement = Announcement::findOrFail($id);

        $visits = Visit::where('url', 'like', "%/announcement/$id%")->get();

        $totalViews = $visits->count();

        $totalResponses = Response::where('announcement_id', $id)->count();

        $respondedUsers = Response::where('announcement_id', $id)
            ->with('user')  // Assuming a relationship with User model is defined
            ->get()
            ->unique('employee_id');

        $uniqueVisitors = $visits->unique('user_id')->count(); // Assuming 'user_id' is available in visits

        $repeatedVisitors = $visits->countBy('user_id')->filter(function ($count) {
            return $count > 1;
        })->count();

        $responseRate = $totalViews > 0 ? ($totalResponses / $totalViews) * 100 : 0;

        $viewsOverTime = $visits->groupBy(function ($visit) {
            return $visit->created_at->format('Y-m-d'); // Group by day
        })->map->count();

        $peakViewingTimes = $visits->groupBy(function ($visit) {
            return $visit->created_at->format('H'); // Group by hour
        })->map->count();

        return Inertia::render('Company/CompanyAnnouncement', [
            'announcement' => $announcement,
            'totalViews' => $totalViews,
            'totalResponses' => $totalResponses,
            'uniqueVisitors' => $uniqueVisitors,
            'repeatedVisitors' => $repeatedVisitors,
            'responseRate' => $responseRate,
            'viewsOverTime' => $viewsOverTime,
            'peakViewingTimes' => $peakViewingTimes,
            'respondedUsers' => $respondedUsers
        ]);
    }

    public function rate($employee_id, $rating): mixed
    {
        if ($rating < 1 || $rating > 5) {
            return response()->json(['error' => 'Invalid rating'], 400);
        }

        try {
            $this->userService->rateUser($employee_id, $rating);
            return redirect('/profile');
        } catch (\Exception $e) {
            Log::error('Error rating user', ['exception' => $e]);
            return response()->json(['error' => 'An error occurred while rating the user'], 500);
        }
    }

    public function logout(): mixed
    {
        Auth::logout();
        return redirect('/');
    }
}

