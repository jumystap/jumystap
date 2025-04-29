<?php

namespace App\Http\Controllers;

use App\Enums\AnnouncementStatus;
use App\Enums\Roles;
use App\Models\Announcement;
use App\Models\AnnouncementAdress;
use App\Models\AnnouncementCondition;
use App\Models\AnnouncementRequirement;
use App\Models\AnnouncementResponsibility;
use App\Models\Industry;
use App\Models\Response;
use App\Models\SpecializationCategory;
use App\Models\TelegramAdmin;
use App\Models\User;
use App\Services\AnnouncementService;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    protected $announcementService;

    public function __construct(AnnouncementService $announcementService)
    {
        $this->announcementService = $announcementService;
    }

    public function index(Request $request): mixed
    {
        $filters = [
            'searchKeyword' => $request->input('searchKeyword'),
            'specialization' => $request->input('specialization'),
            'city' => $request->input('city'),
            'minSalary' => $request->input('minSalary'),
            'isSalary' => $request->input('isSalary'),
            'noExperience' => $request->input('noExperience'),
            'publicTime' => $request->input('publicTime'),
        ];

        $announcements = $this->announcementService->getAllActiveAnnouncements($filters);
        $specializations = SpecializationCategory::with('specialization')->get()->toArray();
        foreach ($specializations as &$category) {
                $category['specialization'][] = [
                    "id" => "_" . $category['id'],
                    "category_id" => $category['id'],
                    "name_ru" => "Все",
                    "name_kz" => "Барлығы"
                ];
        }
        $cities = Announcement::pluck('city')->unique()->filter();

        return Inertia::render('Announcements', [
            'announcements' => $announcements,
            'specializations' => $specializations,
            'cities' => $cities,
        ]);
    }

    public function show($id): mixed
    {
        $announcement = $this->announcementService->getAnnouncement($id);
        if (!$announcement) {
            return redirect()->back()->withErrors(['error' => 'Announcement not found']);
        }

        $user = Auth::user();
        if (
            $announcement->status !== AnnouncementStatus::ACTIVE->value &&
            (!$user || $user->role_id !== Roles::ADMIN->value)
        ) {
            return redirect('announcements');
        }

        $top_announcement = $this->announcementService->getAllActiveAnnouncements()->where('payment_status', 'top')->first();
        $urgent_announcement = $this->announcementService->getAllActiveAnnouncements()->where('payment_status', 'urgent')->first();
        $more_announcement = $this->announcementService->getAllActiveAnnouncementsWithout($id, $announcement->specialization_id);

        return Inertia::render('Announcement', [
            'announcement' => $announcement,
            'top_announcement' => $top_announcement,
            'urgent_announcement' => $urgent_announcement,
            'more_announcement' => $more_announcement
        ]);
    }

    public function store(): mixed
    {
        if(Auth::user()->role_id != 2){
            $industries = Industry::all();
            $specializations = SpecializationCategory::with('specialization')->get();
            return Inertia::render('Company/CreateAnnouncement', [
                'industries' => $industries,
                'specializations' => $specializations,
            ]);
        }else{
            return redirect('/');
        }
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'type_kz' => 'required|string|max:255',
            'type_ru' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable',
            'payment_type' => 'required|string|max:255',
            'cost' => 'required_if:salary_type,exact|nullable|numeric',
            'status' => 'required|int',
            'work_time' => 'nullable',
            'work_hours' => 'nullable|max:255',
            'employemnt_type' => 'nullable',
            'experience' => 'nullable',
            'education' => 'nullable',
            'location' => 'nullable|array', // Validate as an array
            'location.*' => 'string|max:255', // Validate each location item
            'city' => 'nullable|string|max:255',
            'specialization_id' => 'nullable',
            'salary_type' => 'required',
            'cost_min' => 'nullable|numeric',
            'cost_max' => 'nullable|numeric',
            'responsibility' => 'nullable|array', // Validate as an array
            'responsibility.*' => 'string|max:2000', // Validate each responsibility item
            'requirement' => 'nullable|array', // Validate as an array
            'requirement.*' => 'string|max:2000', // Validate each requirement item
            'condition' => 'nullable|array', // Validate as an array
            'condition.*' => 'string|max:2000', // Validate each requirement item
        ]);

        $user = Auth::user();
        Log::info('Creating announcement with data:', $validated);

        try {
            $announcement = $this->announcementService->createAnnouncement(array_merge($validated, [
                'user_id' => $user->id,
                'status' => AnnouncementStatus::ON_MODERATION->value,
            ]));

            if (!empty($validated['location'])) {
                foreach ($validated['location'] as $location) {
                    AnnouncementAdress::create([
                        'announcement_id' => $announcement->id,
                        'adress' => $location,
                    ]);
                }
            }

            if (!empty($validated['responsibility'])) {
                foreach ($validated['responsibility'] as $responsibility) {
                    AnnouncementResponsibility::create([
                        'announcement_id' => $announcement->id,
                        'responsibility' => $responsibility,
                    ]);
                }
            }

            if (!empty($validated['requirement'])) {
                foreach ($validated['requirement'] as $requirement) {
                    AnnouncementRequirement::create([
                        'announcement_id' => $announcement->id,
                        'requirement' => $requirement,
                    ]);
                }
            }

            if (!empty($validated['condition'])) {
                foreach ($validated['condition'] as $requirement) {
                    AnnouncementCondition::create([
                        'announcement_id' => $announcement->id,
                        'condition' => $requirement,
                    ]);
                }
            }

            Log::info('Announcement created successfully', ['announcement' => $announcement]);
            $this->notifyAdmin($announcement, $user);

            return redirect('/profile');
        } catch (\Exception $e) {
            Log::error('Error creating announcement', ['exception' => $e]);
            return redirect()->back()->withErrors(['error' => 'An error occurred while creating the announcement'])->withInput();
        }
    }


    public function edit($id): mixed
    {
        $announcement = $this->announcementService->getAnnouncement($id);
        $industries = Industry::all();
        $specializations = SpecializationCategory::with('specialization')->get();
        $user = Auth::user();

        if($user && ($user->id == $announcement->user_id || $user->email == 'admin@example.com')){
            return Inertia::render('Company/UpdateAnnouncement', [
                'isAdmin' => $user->role_id === Roles::ADMIN->value,
                'announcement' => $announcement,
                'industries' => $industries,
                'specializations' => $specializations
            ]);
        }else{
            return redirect('/');
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('Update request received', ['request' => $request->all(), 'announcement_id' => $id]);

        $validated = $request->validate([
            'type_kz' => 'required|string|max:255',
            'type_ru' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'payment_type' => 'required|string|max:255',
            'cost' => 'required_if:salary_type,exact|nullable|numeric',
            'status' => 'required|int',
            'work_time' => 'nullable|string|max:255', // Assuming work_time is a string
            'work_hours' => 'nullable|max:255',
            'employemnt_type' => 'nullable',
            'experience' => 'nullable',
            'location' => 'nullable|array',
            'location.*.id' => 'nullable|integer', // Ensure each location has an id
            'location.*.adress' => 'nullable|string|max:255', // Ensure each location has an address
            'city' => 'nullable|string|max:255',
            'specialization_id' => 'nullable|integer', // Assuming this is an integer
            'salary_type' => 'required|string|max:255',
            'cost_min' => 'nullable|numeric',
            'cost_max' => 'nullable|numeric',
            'responsibility' => 'nullable|array',
            'responsibility.*.id' => 'required|integer', // Ensure each responsibility has an id
            'responsibility.*.responsibility' => 'required|string|max:2000', // Ensure each responsibility has a description
            'requirement' => 'nullable|array',
            'requirement.*.id' => 'required|integer', // Ensure each requirement has an id
            'requirement.*.requirement' => 'required|string|max:2000', // Ensure each requirement has a description
            'condition' => 'nullable|array',
            'condition.*.id' => 'required|integer', // Ensure each condition has an id
            'condition.*.condition' => 'required|string|max:2000', // Ensure each condition has a description
            'is_top' => "nullable|boolean",
            'is_urgent' => "nullable|boolean",
        ]);

        Log::info('Validation passed', ['validated_data' => $validated]);

        try {
            $success = $this->announcementService->updateAnnouncement($id, array_merge($validated, [
                'status' => AnnouncementStatus::ON_MODERATION->value,
            ]));

            Log::info('Announcement update attempt', ['success' => $success]);

            if ($success) {
                Log::info('Fetching existing related records for announcement', ['announcement_id' => $id]);

                // Delete existing related records
                AnnouncementAdress::where('announcement_id', $id)->delete();
                AnnouncementResponsibility::where('announcement_id', $id)->delete();
                AnnouncementRequirement::where('announcement_id', $id)->delete();
                AnnouncementCondition::where('announcement_id', $id)->delete();

                Log::info('Deleted existing related records');

                // Save new related data
                if (!empty($validated['location'])) {
                    Log::info('Saving new locations', ['locations' => $validated['location']]);
                    foreach ($validated['location'] as $location) {
                        AnnouncementAdress::create([
                            'announcement_id' => $id,
                            'adress' => $location['adress'], // Access 'adress' as a string
                        ]);
                    }
                }

                if (!empty($validated['responsibility'])) {
                    Log::info('Saving new responsibilities', ['responsibilities' => $validated['responsibility']]);
                    foreach ($validated['responsibility'] as $responsibility) {
                        AnnouncementResponsibility::create([
                            'announcement_id' => $id,
                            'responsibility' => $responsibility['responsibility'], // Access 'responsibility' as a string
                        ]);
                    }
                }

                if (!empty($validated['requirement'])) {
                    Log::info('Saving new requirements', ['requirements' => $validated['requirement']]);
                    foreach ($validated['requirement'] as $requirement) {
                        AnnouncementRequirement::create([
                            'announcement_id' => $id,
                            'requirement' => $requirement['requirement'], // Access 'requirement' as a string
                        ]);
                    }
                }

                if (!empty($validated['condition'])) {
                    Log::info('Saving new conditions', ['conditions' => $validated['condition']]);
                    foreach ($validated['condition'] as $condition) {
                        AnnouncementCondition::create([
                            'announcement_id' => $id,
                            'condition' => $condition['condition'], // Access 'condition' as a string
                        ]);
                    }
                }

                Log::info('All related records saved successfully for announcement', ['announcement_id' => $id]);
                $announcement = Announcement::find($id);
                $user = Auth::user();
                $this->notifyAdmin($announcement, $user);
                return redirect('/profile');
            }

            Log::warning('Update announcement failed', ['announcement_id' => $id]);
            throw new \Exception('Failed to update announcement');
        } catch (\Exception $e) {
            Log::error('Error updating announcement', ['exception' => $e->getMessage(), 'announcement_id' => $id]);
            return redirect()->back()->withErrors(['error' => 'An error occurred while updating the announcement'])->withInput();
        }
    }


    public function delete($id): mixed
    {
        try {
            $success = $this->announcementService->deleteAnnouncement($id);
            if ($success) {
                Log::info('Announcement deleted successfully');
                return redirect('/profile')->with('success', 'Announcement deleted successfully');
            }

            throw new \Exception('Failed to delete announcement');
        } catch (\Exception $e) {
            Log::error('Error deleting announcement', ['exception' => $e]);
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the announcement']);
        }
    }

    private function notifyAdmin(Announcement $announcement, User $user)
    {
        Log::info('Starting to notify admin about the new announcement.', ['announcement_id' => $announcement->id]);

        $admin = TelegramAdmin::orderBy('id')->first();

        if ($admin) {
            Log::info('Admin selected for notification.', ['admin_id' => $admin->id, 'admin_name' => $admin->name]);

            $message = "<b>Новое объявление ожидает одобрения</b>\n";
            $message .= "<i>Название компании:</i> " . $user->name . "\n";
            $message .= "<i>Описание компании:</i> " . $user->description . "\n";
            $message .= "<i>Заголовок:</i> " . $announcement->title . "\n";
            $message .= "<i>График:</i> " . $announcement->work_time . "\n";
            $message .= "<i>Город:</i> " . $announcement->city . "\n";
            $message .= "<i>Адрес:</i> " . $announcement->location . "\n";
            $message .= "<i>Описание:</i> " . $announcement->description . "\n";
            $message .= "<i>Тип оплаты:</i> " . $announcement->payment_type . "\n";
            $message .= "<i>Тип зарплаты:</i> " . $announcement->salary_type . "\n";
            $message .= "<i>Зарплата:</i> " . $announcement->cost . $announcement->cost_min . $announcement->cost_max . "\n";
            $message .= "<i>Номер телефона:</i> " . Auth::user()->phone. "\n";
            $message .= "https://jumystap.kz/announcement/" . $announcement->id . "\n";

            try {
                $keyboard = Keyboard::make()
                    ->buttons([
                        Button::make('Принять')
                            ->action('accept')
                            ->param('id', $announcement->id)
                            ->param('chat_id', $admin->chat_id),
                        Button::make('Отклонить')
                            ->action('reject')
                            ->param('id', $announcement->id)
                            ->param('chat_id', $admin->chat_id)
                    ]);

                Telegraph::chat($admin->chat_id)
                    ->message($message)
                    ->keyboard($keyboard)
                    ->send();

                Log::info('Notification sent successfully to admin.', ['admin_id' => $admin->id]);
            } catch (\Exception $e) {
                Log::error('Failed to send notification to admin.', ['admin_id' => $admin->id, 'error' => $e->getMessage()]);
                return;
            }

//            try {
//                $admin->delete();
//                TelegramAdmin::create([
//                    'chat_id' => $admin->chat_id,
//                    'name' => $admin->name,
//                    'username' => $admin->username,
//                ]);
//                Log::info('Admin rotation completed.', ['admin_id' => $admin->id]);
//            } catch (\Exception $e) {
//                Log::error('Failed to rotate admin.', ['admin_id' => $admin->id, 'error' => $e->getMessage()]);
//            }
        } else {
            Log::warning('No admin found for notification.');
        }
    }

    public function response($employee_id, $announcement_id): mixed
    {
        Response::create([
            'announcement_id' => $announcement_id,
            'employee_id' => $employee_id
        ]);

        $announcement = Announcement::find($announcement_id);

        $employer = User::find($announcement->user_id);

        $whatsappUrl = "https://wa.me/". $employer->phone ."?text=Здравствуйте!%0A%0AПишу%20с%20Jumystap.%0A%0A";

        return redirect()->away($whatsappUrl);
    }
}

