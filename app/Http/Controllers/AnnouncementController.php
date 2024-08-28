<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Favorite;
use App\Models\Industry;
use App\Models\Response;
use App\Models\TelegramAdmin;
use App\Models\User;
use App\Services\AnnouncementService;
use App\Telegram\Handler;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AnnouncementController extends Controller
{

    protected $announcementService;

    public function __construct(AnnouncementService $announcementService)
    {
        $this->announcementService = $announcementService;
    }

    public function index(): mixed
    {
        $announcements = Announcement::where('active', 1)->get();

        return Inertia::render('Announcements', [
            'announcements' => $announcements,
        ]);
    }

    public function show($id): mixed
    {
        $announcement = $this->announcementService->getAnnouncement($id);
        $top_announcement = Announcement::where('payment_status', 'top')->first();
        $urgent_announcement = Announcement::where('payment_status', 'urgent')->first();
        $more_announcement = Announcement::inRandomOrder()->take(6)->get();

        return Inertia::render('Announcement', [
            'announcement' => $announcement,
            'top_announcement' => $top_announcement,
            'urgent_announcement' => $urgent_announcement,
            'more_announcement' => $more_announcement
       ]);
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

    public function store():mixed
    {
        $industries = Industry::all();
        return Inertia::render('Company/CreateAnnouncement', [
            'industries' => $industries,
        ]);
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
            'location' => 'nullable',
            'city' => 'nullable',
            'industry_id' => 'nullable',
            'salary_type' => 'required',
            'cost_min' => 'nullable|numeric',
            'cost_max' => 'nullable|numeric',
        ]);

        $user = Auth::user();
        Log::info('Creating announcement with data:', $validated);

        try {
            $announcement = Announcement::create(array_merge($validated, [
                'user_id' => $user->id,
                'active' => 0,
            ]));

            Log::info('Announcement created successfully', ['announcement' => $announcement]);

            $this->notifyAdmin($announcement);

            return redirect('/profile');
        } catch (\Exception $e) {
            Log::error('Error creating announcement', ['exception' => $e]);
            return redirect()->back()->withErrors(['error' => 'An error occurred while creating the announcement'])->withInput();
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
            'cost' => 'required|numeric',
            'active' => 'required|boolean',
            'work_time' => 'nullable',
            'location' => 'nullable',
            'city' => 'nullable',
            'industry_id' => 'nullable',
            'salary_type' => 'required',
            'cost_min' => 'nullable',
            'cost_max' => 'nullable',
        ]);

        try {
            $announcement = Announcement::findOrFail($id);
            $announcement->update([
                'type_kz' => $validated['type_kz'],
                'type_ru' => $validated['type_ru'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'payment_type' => $validated['payment_type'],
                'cost' => $validated['cost'],
                'active' => $validated['active'],
                'location' => $validated['location'] ?? null,
                'work_time' => $validated['work_time'] ?? null,
                'city' => $validated['city'] ?? null,
                'industry_id' => $validated['industry_id'] ?? null,
                'salary_type' => $validated['salary_type'],
                'cost_min' => $validated['cost_min'] ?? null,
                'cost_max' => $validated['cost_max'] ?? null,
            ]);

            Log::info('Announcement updated successfully', ['announcement' => $announcement]);

            $this->notifyAdmin($announcement);

            return redirect('/profile');
        } catch (\Exception $e) {
            Log::error('Error updating announcement', ['exception' => $e]);
            return redirect()->back()->withErrors(['error' => 'An error occurred while updating the announcement'])->withInput();
        }
    }

    private function notifyAdmin(Announcement $announcement)
    {
        Log::info('Starting to notify admin about the new announcement.', ['announcement_id' => $announcement->id]);

        $admin = TelegramAdmin::orderBy('id')->first();

        if ($admin) {
            Log::info('Admin selected for notification.', ['admin_id' => $admin->id, 'admin_name' => $admin->name]);

            $message = "Новое объявление ожидает одобрения:\n";
            $message .= "Заголовок: " . $announcement->title . "\n";
            $message .= "График: " . $announcement->work_time . "\n";
            $message .= "Город: " . $announcement->city . "\n";
            $message .= "Адрес: " . $announcement->location . "\n";
            $message .= "Описание: " . $announcement->description . "\n";
            $message .= "Тип оплаты: " . $announcement->payment_type . "\n";
            $message .= "Стоимость: " . $announcement->cost . "\n";
            $message .= "Номер телефона: " . Auth::user()->phone. "\n";

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

    public function edit($id): mixed
    {
        $announcement = Announcement::find($id);
        $industries = Industry::all();

        return Inertia::render('Company/UpdateAnnouncement', [
            'announcement' => $announcement,
            'industries' => $industries,
        ]);
    }

    public function delete($id): mixed
    {
        try {
            $announcement = Announcement::findOrFail($id);
            Response::where('announcement_id', $id)->delete();
            $announcement->delete();

            Log::info('Announcement deleted successfully', ['announcement' => $announcement]);

            return redirect('/profile')->with('success', 'Announcement deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting announcement', ['exception' => $e]);
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the announcement']);
        }
    }
}

