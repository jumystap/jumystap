<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Profession\Profession;
use App\Models\SpecializationCategory;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Support\Facades\Auth;
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
                    ->select('professions.name_ru as profession_name', 'professions.name_kz as profession_name_kz', 'user_professions.certificate_number')
                    ->where('user_professions.user_id', $user->id)
                    ->get();
                return $user;
            });

        if(Auth::user()){
            $user = Auth::user();

            $resumeSpecializations = DB::table('resume_specializations')
                ->where('resume_id', function($query) use ($user) {
                    $query->select('id')
                        ->from('resumes')
                        ->where('user_id', $user->id)
                        ->limit(1);
                })
                ->pluck('specialization_id');

            $matchedBySpecialization = Announcement::whereIn('specialization_id', $resumeSpecializations)
                ->where('active', 1)
                ->orderBy('created_at', 'desc')
                ->get();

            $specializationCategories = DB::table('specializations')
                ->whereIn('id', $resumeSpecializations)
                ->pluck('category_id');

            $relatedSpecializationIds = DB::table('specializations')
                ->whereIn('category_id', $specializationCategories)
                ->pluck('id');

            $matchedByCategory = Announcement::whereIn('specialization_id', $relatedSpecializationIds)
                ->where('active', 1)
                ->whereNotIn('id', $matchedBySpecialization->pluck('id')) // Exclude already fetched
                ->orderBy('created_at', 'desc')
                ->get();

            $otherAnnouncements = Announcement::where('active', 1)
                ->whereNotIn('id', $matchedBySpecialization->pluck('id')->merge($matchedByCategory->pluck('id')))
                ->orderBy('created_at', 'desc')
                ->get();

            $announcements = Announcement::where(function($query) use ($resumeSpecializations, $relatedSpecializationIds) {
                $query->whereIn('specialization_id', $resumeSpecializations)
                    ->orWhereIn('specialization_id', $relatedSpecializationIds);
            })->where('active', 1)
              ->orderBy('created_at', 'desc')
              ->paginate(10);
        } else {
            $announcements = Announcement::orderBy('created_at', 'desc')->where('active', 1)->paginate(10);
        }

        // Other data remains unchanged
        $urgent_announcements = Announcement::inRandomOrder()->where('active',1 )->take(2)->get();
        $top_announcements = Announcement::inRandomOrder()->where('active', 1)->take(2)->get();
        $work_professions = Profession::where('type', 'work')->with('group')->orderBy('created_at', 'desc')->get();
        $digital_professions = Profession::where('type', 'digital')->with('group')->orderBy('created_at', 'desc')->get();
        $visits = Visit::count();
        $specializations = SpecializationCategory::with('specialization')->get();

        return Inertia::render('Welcome', [
            'employees' => $employees,
            'freelancers' => $freelance_employees,
            'announcements' => $announcements,
            'top_announcements' => $top_announcements,
            'urgent_announcements' => $urgent_announcements,
            'work_professions' => $work_professions,
            'digital_professions' => $digital_professions,
            'visits' => $visits,
            'specializations' => $specializations,
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
