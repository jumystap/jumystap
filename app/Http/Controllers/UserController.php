<?php

namespace App\Http\Controllers;

use App\Enums\Roles;
use App\Enums\AnnouncementStatus;
use App\Http\Requests\User\ProfileUpdateRequest;
use App\Models\Announcement;
use App\Models\AnnouncementVisit;
use App\Models\UserResume;
use App\Services\AnnouncementService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
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
    protected $announcementService;

    public function __construct(UserService $userService, AnnouncementService $announcementService)
    {
        $this->userService = $userService;
        $this->announcementService = $announcementService;
    }

    public function index(Request $request): mixed
    {
        $filters = $request->only(['search', 'profession', 'city', 'isLookingWork', 'withCertificate', 'withResume']);

        $employees = $this->userService->getEmployees($filters);

        return Inertia::render('Employees', [
            'employees' => $employees,
            'professions' => fn () => $this->userService->getAllProfessions(),
            'cities' => fn () => $this->userService->getEmployeeCities(),
            'filters' => $filters
        ]);
    }

    public function login(): mixed
    {
        if (Auth::check()) {
            return redirect('/');
        }
        return Inertia::render('Login', [
            'redirect' => request()->input('redirect'),
        ]);
    }

    public function auth(Request $request): SymfonyRedirectResponse
    {
        $credentials = $request->validate([
            'phone' => 'required',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if($user->is_blocked){
                Auth::logout();
                return redirect()
                    ->back()
                    ->withErrors([
                        'error' => __('messages.errors.account_is_blocked')
                    ])
                    ->withInput();
            }else{
                $redirectTo = $request->input('redirect');
                if ($redirectTo && str_starts_with($redirectTo, '/')) {
                    return redirect($redirectTo);
                }
                return redirect()->back();
            }
        } else {
            return redirect()
                ->back()
                ->withErrors([
                    'error' => __('messages.errors.incorrect_login_or_password')
                ])
                ->withInput();
        }
    }

    public function register(): mixed
    {
        $professions = $this->userService->getAllProfessions();

        return Inertia::render('Registration', [
            'professions' => $professions,
            'redirect'    => request()->input('redirect'),
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
            'date_of_birth' => [
                'nullable',
                'date',
                function ($attribute, $value, $fail) {
                    $age = Carbon::parse($value)->age;

                    if ($age < 16 || $age > 70) {
                        $fail('Возраст должен быть от 16 до 70 лет.');
                    }
                },
            ],
            'gender' => 'nullable',
            'description' => 'nullable|string',
            'source' => 'nullable|string',
            'ipStatus1' => 'nullable|in:no,yes',
            'ipStatus2' => 'nullable|in:no,yes',
            'ipStatus3' => 'nullable|in:no,yes',
        ]);

        if (str_contains($validated['email'], '@noemail.local')) {
            $validated['email'] = 'noemail@noemail.local';
        }
        $validated = array_merge($validated, $this->userService->determineUserStatuses($validated));
        unset($validated['ipStatus1'], $validated['ipStatus2'], $validated['ipStatus3']);

        try {
            $user = $this->userService->storeUser($validated);
            Auth::login($user);

            $redirectTo = $request->input('redirect');
            if ($redirectTo && str_starts_with($redirectTo, '/')) {
                return redirect($redirectTo);
            }
            return redirect('/profile');
        } catch (\Exception $e) {
            Log::error('Error creating user', ['exception' => $e]);
            return redirect()
                ->back()
                ->withErrors([
                    'error' => 'An error occurred while creating the user'
                ])
                ->withInput();
        }
    }

    public function edit(): mixed
    {
        $user = Auth::user()->load('role');
        $roles = Roles::options();

        return Inertia::render('UpdateUser', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function update(ProfileUpdateRequest $request): SymfonyRedirectResponse
    {
        $user = Auth::user();
        $validated = $request->validated();

        try {
            $statuses = $this->userService->determineUserStatuses($validated);
            $validated = array_merge($validated, $statuses);
            unset($validated['ipStatus1'], $validated['ipStatus2'], $validated['ipStatus3']);

            $this->userService->updateUser($user, $validated);

            return redirect('/profile')->with('success', 'Профиль успешно обновлен');
        } catch (\Exception $e) {
            Log::error('Error updating user', ['exception' => $e]);
            return redirect()
                ->back()
                ->withErrors(['error' => 'Произошла ошибка при обновлении профиля'])
                ->withInput();
        }
    }

    public function show($id): mixed
    {
        $user = $this->userService->getUserWithProfessionsAndPortfolio($id);

        if($user->role_id != Roles::EMPLOYEE->value){
            return Inertia::render('NotFound');
        }

        $contactShow = $this->canAuthenticatedUserContactEmployee();
        $user->makeHidden('email');

        if (! $contactShow) {
            $user->makeHidden('phone');
        }

        $userProfessions = $this->userService->getUserProfessions($id);

        $employeeProfessionIds = $this->userService->getUserProfessionIds($id);
        $employees = $this->userService->getUsersByProfessionIds($employeeProfessionIds);

        $resumes = UserResume::where('user_id', $id)
            ->active()
            ->with(['organizations', 'languages'])
            ->get()
            ->map(function ($resume) use ($contactShow) {
                $resume->desired_field_name = $this->getSpecializationName($resume->desired_field);

                $resume->organizations = $resume->organizations->map(function ($organization) {
                    $organization->position_name = $this->getSpecializationName($organization->position_id);
                    return $organization;
                });

                if (! $contactShow) {
                    $resume->makeHidden(['email', 'phone']);
                }

                return $resume;
            });

        return Inertia::render('User', [
            'user' => $user,
            'contactShow' => $contactShow,
            'employees' => $employees,
            'userProfessions' => $userProfessions,
            'resumes' => $resumes,
            'roles' => [
                'employer' => Roles::EMPLOYER->value,
                'company' => Roles::COMPANY->value,
            ],
        ]);
    }

    private function canAuthenticatedUserContactEmployee(): bool
    {
        $currentUser = Auth::user();
        $employerRoleIds = collect([
            Roles::EMPLOYER->value,
            Roles::COMPANY->value,
        ]);

        if (! $currentUser || ! $employerRoleIds->contains((int) $currentUser->role_id)) {
            return false;
        }

        return Announcement::query()
            ->where('user_id', $currentUser->id)
            ->where('status', AnnouncementStatus::ACTIVE->value)
            ->exists();
    }

    public function profile(): mixed
    {
        $user = Auth::user()->load(['role', 'portfolio', 'announcement']);
        $userProfessions = $this->userService->getUserProfessions($user->id);

        $visitCounts = DB::table('announcement_visits')
            ->whereIn('announcement_id', $user->announcement->pluck('id'))
            ->selectRaw('announcement_id, COUNT(*) as aggregate')
            ->groupBy('announcement_id')
            ->pluck('aggregate', 'announcement_id');

        foreach ($user->announcement as $announcement) {
            $announcement->visit_count = (int) ($visitCounts[$announcement->id] ?? 0);
        }

        $announcements = $this->userService->getLatestAnnouncements(true);
        $professions = $this->userService->getAllProfessions();

        $resumes = UserResume::where('user_id', Auth::id())
            ->with(['organizations', 'languages'])
            ->get()
            ->map(function ($resume) {
                $resume->desired_field_name = $this->getSpecializationName($resume->desired_field);

                $resume->organizations = $resume->organizations->map(function ($organization) {
                    $organization->position_name = $this->getSpecializationName($organization->position_id);
                    return $organization;
                });

                return $resume;
            });

        return Inertia::render('Profile', [
            'user' => $user,
            'announcements' => $announcements,
            'employees' => $user,
            'professions' => $professions,
            'userProfessions' => $userProfessions,
            'resumes' => $resumes,
        ]);
    }

    public function responses(): mixed
    {
        $user = Auth::user()->load(['portfolio']);
        $userProfessions = $this->userService->getUserProfessions($user->id);
        $announcements = $this->announcementService->getAllActiveAnnouncementsByIds($user->response->pluck('announcement_id')->toArray());
        return Inertia::render('UserResponses', [
            'user' => $user,
            'announcements' => $announcements,
            'userProfessions' => $userProfessions,
        ]);
    }

    private function getSpecializationName($id)
    {
        return DB::table('specializations')->where('id', $id)->value('name_ru');
    }

    public function myAnnouncement($id)
    {
        $announcement = Announcement::findOrFail($id);
        /** @var User $user */
        $user = Auth::user();

        if ($user && ($user->id === $announcement->user_id || $user->role->name === 'admin')) {

            $totalViews = AnnouncementVisit::where('announcement_id', $id)->count();

            $totalResponses = Response::where('announcement_id', $id)->count();

            // Уникальные/повторные посетители по announcement_visits (по индексу).
            // Посетитель = user_id для залогиненных, иначе ip_address (гости).
            $visitorKey = "COALESCE(CONCAT('u:', user_id), CONCAT('ip:', ip_address))";

            $uniqueVisitors = (int) DB::table('announcement_visits')
                ->where('announcement_id', $id)
                ->distinct()
                ->count(DB::raw($visitorKey));

            $repeatedVisitors = (int) DB::query()->fromSub(
                DB::table('announcement_visits')
                    ->where('announcement_id', $id)
                    ->selectRaw("$visitorKey as visitor_key")
                    ->groupBy('visitor_key')
                    ->havingRaw('COUNT(*) > 1'),
                'repeated'
            )->count();

            $responseRate = $totalViews > 0 ? ($totalResponses / $totalViews) * 100 : 0;

            $respondedUsers = Response::where('announcement_id', $id)
                ->with('user')
                ->get()
                ->unique('employee_id')
                ->values();

            $resumeMap = $this->latestActiveResumeIds($respondedUsers->pluck('employee_id'));

            $respondedUsers->transform(function ($respond) use ($resumeMap) {
                $respond->resume_id = $resumeMap[$respond->employee_id] ?? null;
                $respond->responded_at = $respond->created_at?->format('d.m.Y H:i');
                return $respond;
            });

            return Inertia::render('Company/CompanyAnnouncement', [
                'announcement'     => $announcement,
                'totalViews'       => $totalViews,
                'totalResponses'   => $totalResponses,
                'uniqueVisitors'   => $uniqueVisitors,
                'repeatedVisitors' => $repeatedVisitors,
                'responseRate'     => $responseRate,
                'respondedUsers'   => $respondedUsers,
            ]);
        } else {
            return redirect('profile')->withErrors(['error' => __('messages.announcements.errors.does_not_access_to_view')]);
        }
    }

    /**
     * Отклики на все вакансии работодателя (таблицей). Одна строка = один отклик.
     */
    public function myResponses(): mixed
    {
        $user = Auth::user();

        $ownAnnouncementIds = Announcement::where('user_id', $user->id)->pluck('id');

        $responses = Response::whereIn('announcement_id', $ownAnnouncementIds)
            ->with(['user:id,name', 'announcement:id,title'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $resumeMap = $this->latestActiveResumeIds($responses->getCollection()->pluck('employee_id'));

        $responses->through(fn ($response) => [
            'id'           => $response->id,
            'responded_at' => $response->created_at?->format('d.m.Y H:i'),
            'announcement' => [
                'id'    => $response->announcement_id,
                'title' => $response->announcement?->title,
            ],
            'user' => [
                'id'   => $response->employee_id,
                'name' => $response->user?->name,
            ],
            'resume_id' => $resumeMap[$response->employee_id] ?? null,
        ]);

        return Inertia::render('Company/EmployerResponses', [
            'responses' => $responses,
        ]);
    }

    /**
     * Карта employee_id => id последнего активного резюме (батч, без N+1).
     */
    private function latestActiveResumeIds(Collection $employeeIds): Collection
    {
        return UserResume::whereIn('user_id', $employeeIds)
            ->active()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get(['id', 'user_id'])
            ->groupBy('user_id')
            ->map(fn ($group) => $group->first()->id);
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
