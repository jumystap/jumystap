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
        $freelance_employees = User::getUsersByWorkStatus("Ищет заказы")
            ->with("profession")
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($user) {
                $user->professions = DB::table("user_professions")
                    ->join(
                        "professions",
                        "user_professions.profession_id",
                        "=",
                        "professions.id"
                    )
                    ->select(
                        "professions.name_ru as profession_name",
                        "professions.name_kz as profession_name_kz",
                        "user_professions.certificate_number"
                    )
                    ->where("user_professions.user_id", $user->id)
                    ->get();
                return $user;
            });

        $employees = User::getUsersByWorkStatus("Ищет работу")
            ->with("profession")
            ->inRandomOrder()
            ->take(12)
            ->get()
            ->map(function ($user) {
                $user->professions = DB::table("user_professions")
                    ->join(
                        "professions",
                        "user_professions.profession_id",
                        "=",
                        "professions.id"
                    )
                    ->select(
                        "professions.name_ru as profession_name",
                        "professions.name_kz as profession_name_kz",
                        "user_professions.certificate_number"
                    )
                    ->where("user_professions.user_id", $user->id)
                    ->get();
                return $user;
            });

        if (Auth::user()) {
            $user = Auth::user();

            $isResume = Resume::where("user_id", $user->id)->first();

            if ($isResume) {
                $resumeSpecializations = DB::table("resume_specializations")
                    ->where("resume_id", function ($query) use ($user) {
                        $query
                            ->select("id")
                            ->from("resumes")
                            ->where("user_id", $user->id)
                            ->orderBy("created_at", "desc")
                            ->limit(1);
                    })
                    ->pluck("specialization_id");

                // Step 1: Get announcements that match the user's specialization
                $matchedBySpecialization = Announcement::whereIn(
                    "specialization_id",
                    $resumeSpecializations
                )
                    ->where("status", AnnouncementStatus::ACTIVE->value)
                    ->orderBy("created_at", "desc")
                    ->get();

                $specializationCategories = DB::table("specializations")
                    ->whereIn("id", $resumeSpecializations)
                    ->pluck("category_id");

                $relatedSpecializationIds = DB::table("specializations")
                    ->whereIn("category_id", $specializationCategories)
                    ->pluck("id");

                $matchedByCategory = Announcement::whereIn(
                    "specialization_id",
                    $relatedSpecializationIds
                )
                    ->where("status", AnnouncementStatus::ACTIVE->value)
                    ->whereNotIn("id", $matchedBySpecialization->pluck("id")) // Exclude already fetched
                    ->orderBy("created_at", "desc")
                    ->get();

                $otherAnnouncements = Announcement::where("status", AnnouncementStatus::ACTIVE->value)
                    ->whereNotIn(
                        "id",
                        $matchedBySpecialization
                            ->pluck("id")
                            ->merge($matchedByCategory->pluck("id"))
                    )
                    ->orderBy("created_at", "desc")
                    ->get();

                $allAnnouncements = $matchedBySpecialization
                    ->merge($matchedByCategory)
                    ->merge($otherAnnouncements);

                // Manually paginate the merged collection
                $currentPage = request()->get("page", 1);
                $perPage = 10;

                $announcements = new LengthAwarePaginator(
                    $allAnnouncements
                        ->forPage($currentPage, $perPage)
                        ->values()
                        ->all(), // Paginate collection
                    $allAnnouncements->count(), // Total items
                    $perPage,
                    $currentPage,
                    ["path" => request()->url(), "query" => request()->query()]
                );
            } else {
                // If the user doesn't have a resume, just show announcements ordered by creation date
                $announcements = Announcement::orderBy("created_at", "desc")
                    ->where("status", AnnouncementStatus::ACTIVE->value)
                    ->paginate(10);
            }
        } else {
            // For guests, show announcements ordered by creation date
            $announcements = Announcement::orderBy("created_at", "desc")
                ->where("status", AnnouncementStatus::ACTIVE->value)
                ->paginate(10);
        }

        // Other data remains unchanged
        $urgent_announcements = Announcement::query()
            ->where("status", AnnouncementStatus::ACTIVE->value) // Ensure it's active
            ->where('is_urgent', 1)
            ->take(3)
            ->inRandomOrder()
            ->get();
        $top_announcements = Announcement::query()
            ->where("status", AnnouncementStatus::ACTIVE->value) // Ensure it's active
            ->where("is_top", 1)
            ->whereNotIn('id', collect($urgent_announcements)->pluck('id'))
            ->take(3)
            ->inRandomOrder()
            ->get();
        $work_professions = Profession::where("type", "work")
            ->with("group")
            ->orderBy("created_at", "desc")
            ->get();
        $digital_professions = Profession::where("type", "digital")
            ->with("group")
            ->orderBy("created_at", "desc")
            ->get();
        $visits = Visit::count();
        $specializations = SpecializationCategory::with(
            "specialization"
        )->get();

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
