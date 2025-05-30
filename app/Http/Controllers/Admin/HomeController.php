<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Response;
use App\Models\User;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request): Factory|View|Application
    {
        $data = [];
        $search = $request->get('search');

        if (!$search) {
            $search = [
                'start_date'         => null,
                'end_date'           => null,
            ];
        }

        $data['usersCount'] = User::query()
            ->whereNotIn('role_id', [Roles::ADMIN->value, Roles::MODERATOR->value])
            ->count();
        $data['allEmployersCount'] = User::query()
            ->whereIn('role_id', [Roles::COMPANY->value, Roles::EMPLOYER->value])
            ->count();
        $data['employerCount'] = User::query()
            ->where('role_id', Roles::EMPLOYER->value)
            ->count();
        $data['companyCount'] = User::query()
            ->where('role_id', Roles::COMPANY->value)
            ->count();
        $data['allEmployeesCount'] = User::query()
            ->where('role_id', Roles::EMPLOYEE->value)
            ->count();
        $data['graduatesCount'] = User::query()
            ->where('role_id', Roles::EMPLOYEE->value)
            ->where('is_graduate', true)
            ->count();
        $data['nonGraduatesCount'] = User::query()
            ->where('role_id', Roles::EMPLOYEE->value)
            ->where('is_graduate', false)
            ->count();
        $data['registeredTodayCount'] = User::query()
            ->whereNotIn('role_id', [Roles::ADMIN->value, Roles::MODERATOR->value])
            ->whereDate('created_at', '>=', today())
            ->count();
        $data['announcementsCount'] = Announcement::query()
            ->where('status', AnnouncementStatus::ACTIVE)
            ->count();
        $data['responsesCount'] = Response::query()
            ->whereNotNull('announcement_id')
            ->count();
        $data['responsesTodayCount'] = Response::query()
            ->whereNotNull('announcement_id')
            ->whereDate('created_at', '>=', today())
            ->count();

        session()->flash('success', __('Страница успешно загружена!'));
        return view('admin.home', compact('data'));
    }

}
