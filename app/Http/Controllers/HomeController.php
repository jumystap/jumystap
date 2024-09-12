<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Profession\Profession;
use App\Models\User;
use App\Models\Visit;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function index(): mixed
    {
        $freelance_employees = User::getUsersByWorkStatus('Ищет заказы')
            ->with('profession')
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($user) {
                $user->professions = DB::table('user_professions')
                    ->join('professions', 'user_professions.profession_id', '=', 'professions.id')
                    ->select('professions.name_ru as profession_name', 'professions.name_kz as profession_name_kz', 'user_professions.certificate_number')
                    ->where('user_professions.user_id', $user->id)
                    ->get();
                return $user;
            });

        $employees = User::getUsersByWorkStatus('Ищет работу')
            ->with('profession')
            ->inRandomOrder()
            ->take(12)
            ->get()
            ->map(function ($user) {
                $user->professions = DB::table('user_professions')
                    ->join('professions', 'user_professions.profession_id', '=', 'professions.id')
                    ->select('professions.name_ru as profession_name', 'professions.name_kz as profession_name_kz','user_professions.certificate_number')
                    ->where('user_professions.user_id', $user->id)
                    ->get();
                return $user;
            });

        $announcements = Announcement::orderBy('created_at', 'desc')->where('active', 1)->paginate(10);
        $urgent_announcements = Announcement::inRandomOrder()->take(2)->get();
        $top_announcements = Announcement::inRandomOrder()->take(2)->get();
        $work_professions = Profession::where('type', 'work')->with('group')->orderBy('created_at', 'desc')->get();
        $digital_professions = Profession::where('type', 'digital')->with('group')->orderBy('created_at', 'desc')->get();
        $visits = Visit::count();

        return Inertia::render('Welcome', [
            'employees' => $employees,
            'freelancers' => $freelance_employees,
            'announcements' => $announcements,
            'top_announcements' => $top_announcements,
            'urgent_announcements' => $urgent_announcements,
            'work_professions' => $work_professions,
            'digital_professions' => $digital_professions,
            'visits' => $visits
        ]);
    }

    public function faq(): mixed
    {
        return Inertia::render('FAQ');
    }

    public function about(): mixed
    {
        return Inertia::render('About');
    }

    public function terms(): mixed
    {
        return Inertia::render('Terms');
    }
}
