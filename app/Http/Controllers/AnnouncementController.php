<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementAdress;
use App\Models\AnnouncementCondition;
use App\Models\AnnouncementRequirement;
use App\Models\AnnouncementResponsibility;
use App\Models\Industry;
use App\Models\Response;
use App\Models\Specialization;
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
            'publicTime' => $request->input('publicTime'),
        ];

        $announcements = $this->announcementService->getAllActiveAnnouncements($filters);
        $specializations = SpecializationCategory::with('specialization')->get();
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

        $top_announcement = $this->announcementService->getAllActiveAnnouncements()->where('payment_status', 'top')->first();
        $urgent_announcement = $this->announcementService->getAllActiveAnnouncements()->where('payment_status', 'urgent')->first();
        $more_announcement = $this->announcementService->getAllActiveAnnouncements()->take(6);

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
            'description' => 'required',
            'payment_type' => 'required|string|max:255',
            'cost' => 'nullable|numeric',
            'active' => 'required|boolean',
            'work_time' => 'nullable',
            'location' => 'nullable|array', // Validate as an array
            'location.*' => 'string|max:255', // Validate each location item
            'city' => 'nullable|string|max:255',
            'specialization_id' => 'nullable',
            'salary_type' => 'required',
            'cost_min' => 'nullable|numeric',
            'cost_max' => 'nullable|numeric',
            'responsobility' => 'nullable|array', // Validate as an array
            'responsobility.*' => 'string|max:255', // Validate each responsibility item
            'requirement' => 'nullable|array', // Validate as an array
            'requirement.*' => 'string|max:255', // Validate each requirement item
            'condition' => 'nullable|array', // Validate as an array
            'condition.*' => 'string|max:255', // Validate each requirement item
        ]);

        $user = Auth::user();
        Log::info('Creating announcement with data:', $validated);

        try {
            $announcement = $this->announcementService->createAnnouncement(array_merge($validated, [
                'user_id' => $user->id,
                'active' => 0,
            ]));

            if (!empty($validated['location'])) {
                foreach ($validated['location'] as $location) {
                    AnnouncementAdress::create([
                        'announcement_id' => $announcement->id,
                        'adress' => $location,
                    ]);
                }
            }

            if (!empty($validated['responsobility'])) {
                foreach ($validated['responsobility'] as $responsibility) {
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
        $announcement = Announcement::find($id);
        $industries = Industry::all();
        $specializations = SpecializationCategory::with('specialization')->get();

        if(Auth::user()->id == $announcement->user_id || Auth::user()->email == 'admin@example.com'){
            return Inertia::render('Company/UpdateAnnouncement', [
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
        $validated = $request->validate([
            'type_kz' => 'required|string|max:255',
            'type_ru' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'payment_type' => 'required|string|max:255',
            'cost' => 'nullable|numeric',
            'active' => 'required|boolean',
            'work_time' => 'nullable',
            'location' => 'nullable',
            'city' => 'nullable',
            'specialization_id' => 'nullable',
            'salary_type' => 'required',
            'cost_min' => 'nullable|numeric',
            'cost_max' => 'nullable|numeric',
        ]);

        try {
            $success = $this->announcementService->updateAnnouncement($id, array_merge($validated, [
                'active' => 0,
            ]));
            if ($success) {
                Log::info('Announcement updated successfully');
                $announcement = Announcement::find($id);
                $user = Auth::user();
                $this->notifyAdmin($announcement, $user);
                return redirect('/profile');
            }

            throw new \Exception('Failed to update announcement');
        } catch (\Exception $e) {
            Log::error('Error updating announcement', ['exception' => $e]);
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

            $message = "Новое объявление ожидает одобрения:\n";
            $message .= "Название компании: " . $user->name . "\n";
            $message .= "Описание компании: " . $user->description . "\n";
            $message .= "Заголовок: " . $announcement->title . "\n";
            $message .= "График: " . $announcement->work_time . "\n";
            $message .= "Город: " . $announcement->city . "\n";
            $message .= "Адрес: " . $announcement->location . "\n";
            $message .= "Описание: " . $announcement->description . "\n";
            $message .= "Тип оплаты: " . $announcement->payment_type . "\n";
            $message .= "Тип зарплаты: " . $announcement->salary_type . "\n";
            $message .= "Зарплата: " . $announcement->cost . $announcement->cost_min . $announcement->cost_max . "\n";
            $message .= "Номер телефона: " . Auth::user()->phone. "\n";
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

            try {
                $admin->delete();
                TelegramAdmin::create([
                    'chat_id' => $admin->chat_id,
                    'name' => $admin->name,
                    'username' => $admin->username,
                ]);
                Log::info('Admin rotation completed.', ['admin_id' => $admin->id]);
            } catch (\Exception $e) {
                Log::error('Failed to rotate admin.', ['admin_id' => $admin->id, 'error' => $e->getMessage()]);
            }
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

