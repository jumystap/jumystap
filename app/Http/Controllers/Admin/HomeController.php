<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Response;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function index(Request $request): Factory|View|Application
    {
        $search = $request->get('search', [
            'start_date' => null,
            'end_date'   => null,
        ]);

        $startDate = $search['start_date'] ? Carbon::parse($search['start_date'])->startOfDay() : null;
        $endDate   = $search['end_date'] ? Carbon::parse($search['end_date'])->endOfDay() : null;

        $excludedRoles = [Roles::ADMIN->value, Roles::MODERATOR->value];
        $employerRoles = [Roles::COMPANY->value, Roles::EMPLOYER->value];
        $employeeQuery = User::query()->where('role_id', Roles::EMPLOYEE->value);

        // Универсальный callback для фильтрации по дате
        $filterByDate = function ($query) use ($startDate, $endDate) {
            if ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->where('created_at', '<=', $endDate);
            }
        };

        $announcementsBySpecializations = Announcement::select('specialization_categories.id as category_id', 'specialization_categories.name_ru', DB::raw('count(announcements.id) as total'))
            ->join('specializations', 'announcements.specialization_id', '=', 'specializations.id')
            ->join('specialization_categories', 'specializations.category_id', '=', 'specialization_categories.id')
            ->groupBy('specialization_categories.id', 'specialization_categories.name_ru')
            ->where('specialization_categories.id', '!=', 19)
            ->get();

        $announcementsByCities = Announcement::select('city', DB::raw('count(*) as total'))
            ->whereIn('city', ["Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
                               "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
                               "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
                               "Экибастуз", "Рудный", "Жезказган"])
            ->where('status', 1)
            ->groupBy('city')
            ->get();

        $costAverages = DB::table('announcements as a')
            ->join('specializations as s', 'a.specialization_id', '=', 's.id')
            ->join('specialization_categories as sc', 's.category_id', '=', 'sc.id')
            ->select(
                'sc.id as category_id',
                'sc.name_ru as category_name',
                DB::raw("
            AVG(
                CASE
                    WHEN a.cost_min IS NOT NULL AND a.cost_max IS NOT NULL THEN (a.cost_min + a.cost_max) / 2
                    WHEN a.cost_min IS NOT NULL THEN a.cost_min
                    WHEN a.cost_max IS NOT NULL THEN a.cost_max
                END
            ) as average_salary
        ")
            )
            ->whereIn('a.salary_type', ['diapason', 'exact'])
            ->where('a.status', 1)
            ->where('sc.id', '!=', 19)
            ->groupBy('sc.id', 'sc.name_ru')
            ->get();

        $data = [
            'usersCount'                     => User::whereNotIn('role_id', $excludedRoles)->tap($filterByDate)->count(),
            'allEmployersCount'              => User::whereIn('role_id', $employerRoles)->tap($filterByDate)->count(),
//            'employerCount'                  => User::where('role_id', Roles::EMPLOYER->value)->tap($filterByDate)->count(),
//            'companyCount'                   => User::where('role_id', Roles::COMPANY->value)->tap($filterByDate)->count(),
            'allEmployeesCount'              => (clone $employeeQuery)->tap($filterByDate)->count(),
            'graduatesCount'                 => (clone $employeeQuery)->where('is_graduate', true)->tap($filterByDate)->count(),
//            'nonGraduatesCount'              => (clone $employeeQuery)->where('is_graduate', false)->tap($filterByDate)->count(),
            'registeredTodayCount'           => User::whereNotIn('role_id', $excludedRoles)
                ->whereDate('created_at', today())
                ->count(),
            'announcementsCount'             => Announcement::where('status', AnnouncementStatus::ACTIVE)
                ->tap($filterByDate)->count(),
            'responsesCount'                 => Response::whereNotNull('announcement_id')->tap($filterByDate)->count(),
            'responsesTodayCount'            => Response::whereNotNull('announcement_id')
                ->whereDate('created_at', today())
                ->count(),
            'announcementsBySpecializations' => [
                'name'  => $announcementsBySpecializations->pluck('name_ru'),
                'total' => $announcementsBySpecializations->pluck('total'),
            ],
            'announcementsByCities'          => $announcementsByCities,
            'costAverages'                   => [
                'name'  => $costAverages->pluck('category_name'),
                'total' => $costAverages->pluck('average_salary'),
            ],
        ];
//        dd($announcementsByCities);

        session()->flash('success', __('Страница успешно загружена!'));
        return view('admin.home', compact('data', 'search'));
    }

}
