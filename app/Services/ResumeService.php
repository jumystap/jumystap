<?php

namespace App\Services;

use App\Enums\ResumeStatus;
use App\Models\TelegramAdmin;
use App\Models\UserResume;
use App\Repositories\ResumeRepository;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Illuminate\Support\Facades\Log;

class ResumeService
{
    public function __construct(private ResumeRepository $resumeRepository)
    {
    }

    public function getForModeration(array $filters, int $perPage = 20)
    {
        return $this->resumeRepository->paginateForAdmin($filters, $perPage);
    }

    /**
     * Record the initial "sent for moderation" history entry for a freshly
     * created resume and notify admins. The resume is created with the
     * MODERATION status already set.
     */
    public function submitForModeration(UserResume $resume): void
    {
        $resume->statusHistory()->create([
            'status_from' => null,
            'status_to'   => ResumeStatus::MODERATION->value,
            'changed_by'  => auth()->id(),
            'comment'     => null,
            'changed_at'  => now(),
        ]);

        $this->notifyAdmins($resume);
    }

    /**
     * A published/rejected resume was edited by its owner — send it back to
     * moderation, clear the previous rejection reason, and re-notify admins.
     */
    public function returnToModeration(UserResume $resume): void
    {
        // Already pending: admins were notified on the previous submit,
        // re-notifying on every content edit would spam them.
        if ($resume->status === ResumeStatus::MODERATION) {
            return;
        }

        $resume->reject_reason = null;
        $resume->changeStatus(ResumeStatus::MODERATION);

        $this->notifyAdmins($resume);
    }

    public function approve(UserResume $resume): bool
    {
        $resume->reject_reason = null;

        if (!$resume->published_at) {
            $resume->published_at = now();
        }

        return $resume->changeStatus(ResumeStatus::ACTIVE);
    }

    public function reject(UserResume $resume, ?string $reason = null): bool
    {
        $resume->reject_reason = $reason;

        return $resume->changeStatus(ResumeStatus::REJECTED, $reason);
    }

    private function notifyAdmins(UserResume $resume): void
    {
        $resume->loadMissing('user');

        $message = "<b>Новое резюме ожидает одобрения</b>\n";
        $message .= "<i>Кандидат:</i> " . ($resume->user->name ?? '—') . "\n";
        $message .= "<i>Должность:</i> " . $resume->position . "\n";
        $message .= "<i>Город:</i> " . $resume->city . "\n";
        $message .= "<i>Зарплата:</i> " . ($resume->formatted_salary ?: '—') . " ₸\n";
        $message .= "<i>Телефон:</i> " . $resume->phone . "\n";
        $message .= "https://jumystap.kz/resumes/" . $resume->id . "\n";

        // Когда задан выделенный чат модерации, шлём только в него —
        // резюме содержит ПДн кандидата, а в telegram_admins попадает
        // любой, кто написал боту /start.
        $moderationChatId = config('services.telegram.resume_moderation_chat_id');

        if ($moderationChatId) {
            $this->sendModerationMessage((string) $moderationChatId, $message, $resume);

            return;
        }

        $admins = TelegramAdmin::orderBy('id')->get()->unique('chat_id')->values();

        if ($admins->isEmpty()) {
            Log::warning('No Telegram admins registered for resume moderation notification.', [
                'resume_id' => $resume->id,
            ]);

            return;
        }

        foreach ($admins as $admin) {
            $this->sendModerationMessage((string) $admin->chat_id, $message, $resume);
        }
    }

    private function sendModerationMessage(string $chatId, string $message, UserResume $resume): void
    {
        try {
            $keyboard = Keyboard::make()->buttons([
                Button::make('Принять')
                    ->action('acceptResume')
                    ->param('id', $resume->id)
                    ->param('chat_id', $chatId),
                Button::make('Отклонить')
                    ->action('rejectResume')
                    ->param('id', $resume->id)
                    ->param('chat_id', $chatId),
            ]);

            Telegraph::chat($chatId)
                ->message($message)
                ->keyboard($keyboard)
                ->send();

            Log::info('Resume moderation notification sent.', [
                'chat_id'   => $chatId,
                'resume_id' => $resume->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send resume moderation notification.', [
                'chat_id'   => $chatId,
                'resume_id' => $resume->id,
                'error'     => $e->getMessage(),
            ]);
        }
    }
}
