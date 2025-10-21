<?php

namespace App\Http\Controllers;

use App\Enums\AnnouncementStatus;
use App\Models\Announcement;
use App\Models\Profession\Profession;
use App\Models\Resume;
use App\Models\SpecializationCategory;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class HomeController extends Controller
{
    public function index(): mixed
    {
        $searchKeyword = request()->input('searchKeyword');

        $getUserProfessions = function ($userId) {
            return DB::table("user_professions")
                ->join("professions", "user_professions.profession_id", "=", "professions.id")
                ->select(
                    "professions.name_ru as profession_name",
                    "professions.name_kz as profession_name_kz",
                    "user_professions.certificate_number"
                )
                ->where("user_professions.user_id", $userId)
                ->get();
        };

        $freelance_employees = User::getUsersByWorkStatus("Ищет заказы")
            ->with("profession")
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($user) use ($getUserProfessions) {
                $user->professions = $getUserProfessions($user->id);
                return $user;
            });

        $employees = User::getUsersByWorkStatus("Ищет работу")
            ->with("profession")
            ->inRandomOrder()
            ->take(12)
            ->get()
            ->map(function ($user) use ($getUserProfessions) {
                $user->professions = $getUserProfessions($user->id);
                return $user;
            });

        $announcements = [];

        if (Auth::check()) {
            $user = Auth::user();
            $resume = Resume::where("user_id", $user->id)->latest()->first();

            if ($resume) {
                $resumeSpecializations = DB::table("resume_specializations")
                    ->where("resume_id", $resume->id)
                    ->pluck("specialization_id");

                $specializationCategories = DB::table("specializations")
                    ->whereIn("id", $resumeSpecializations)
                    ->pluck("category_id");

                $relatedSpecializationIds = DB::table("specializations")
                    ->whereIn("category_id", $specializationCategories)
                    ->pluck("id");

                $matchedBySpecialization = Announcement::whereIn("specialization_id", $resumeSpecializations)
                    ->where("status", AnnouncementStatus::ACTIVE->value)
                    ->when($searchKeyword, function ($query, $keyword) {
                        $query->where(function ($q) use ($keyword) {
                            $q->where("title", "like", "%{$keyword}%")
                                ->orWhere("description", "like", "%{$keyword}%");
                        });
                    })
                    ->orderBy("created_at", "desc")
                    ->get();

                $matchedByCategory = Announcement::whereIn("specialization_id", $relatedSpecializationIds)
                    ->where("status", AnnouncementStatus::ACTIVE->value)
                    ->whereNotIn("id", $matchedBySpecialization->pluck("id"))
                    ->when($searchKeyword, function ($query, $keyword) {
                        $query->where(function ($q) use ($keyword) {
                            $q->where("title", "like", "%{$keyword}%")
                                ->orWhere("description", "like", "%{$keyword}%");
                        });
                    })
                    ->orderBy("created_at", "desc")
                    ->get();

                $otherAnnouncements = Announcement::where("status", AnnouncementStatus::ACTIVE->value)
                    ->whereNotIn("id", $matchedBySpecialization->pluck("id")->merge($matchedByCategory->pluck("id")))
                    ->when($searchKeyword, function ($query, $keyword) {
                        $query->where(function ($q) use ($keyword) {
                            $q->where("title", "like", "%{$keyword}%")
                                ->orWhere("description", "like", "%{$keyword}%");
                        });
                    })
                    ->orderBy("created_at", "desc")
                    ->get();

                $allAnnouncements = $matchedBySpecialization
                    ->merge($matchedByCategory)
                    ->merge($otherAnnouncements);

                $currentPage = request()->get("page", 1);
                $perPage = 10;

//                $announcements = new LengthAwarePaginator(
//                    $allAnnouncements->forPage($currentPage, $perPage)->values()->all(),
//                    $allAnnouncements->count(),
//                    $perPage,
//                    $currentPage,
//                    ["path" => request()->url(), "query" => request()->query()]
//                );
            }
        }

        // Гости и пользователи без резюме
        if (empty($announcements)) {
            $ids = [4206, 4156, 4377, 4112, 4289, 4186, 4376, 4363, 4142, 4372, 4399, 4417];

            $announcements = Announcement::where("status", AnnouncementStatus::ACTIVE->value)
                ->when($searchKeyword, function ($query, $keyword) {
                    $query->where(function ($q) use ($keyword) {
                        $q->where("title", "like", "%{$keyword}%")
                            ->orWhere("description", "like", "%{$keyword}%");
                    });
                })
                // сортируем так, чтобы выбранные ID шли первыми
                ->orderByRaw('FIELD(id, ' . implode(',', $ids) . ') DESC')
                // а потом уже по дате (для остальных)
                ->orderBy("created_at", "desc")
                ->paginate(12)
                ->withQueryString();

        }

        // Доп. объявления
        $urgent_announcements = Announcement::where("status", AnnouncementStatus::ACTIVE->value)
            ->where("is_urgent", 1)
            ->inRandomOrder()
            ->take(3)
            ->get();

        $top_announcements = Announcement::where("status", AnnouncementStatus::ACTIVE->value)
            ->where("is_top", 1)
            ->whereNotIn("id", $urgent_announcements->pluck("id"))
            ->inRandomOrder()
            ->take(3)
            ->get();

        // Профессии
        $work_professions = Profession::where("type", "work")->with("group")->latest()->get();
        $digital_professions = Profession::where("type", "digital")->with("group")->latest()->get();

        $visits = Visit::count();

        $specializations = SpecializationCategory::with("specialization")->get();

        return Inertia::render("Welcome", [
            "employees" => $employees,
            "freelancers" => $freelance_employees,
            "announcements" => $announcements,
            "top_announcements" => $top_announcements,
            "urgent_announcements" => $urgent_announcements,
            "work_professions" => $work_professions,
            "digital_professions" => $digital_professions,
            "visits" => $visits,
            "specializations" => $specializations,
        ]);
    }

    public function faq(): mixed
    {
        return Inertia::render("FAQ");
    }

    public function about(): mixed
    {
        return Inertia::render("About");
    }

    public function terms(): mixed
    {
        return Inertia::render("Terms");
    }

    public function chat(): mixed
    {
        return Inertia::render("Chat");
    }
}
