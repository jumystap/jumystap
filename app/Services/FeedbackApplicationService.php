<?php

namespace App\Services;

use App\Models\FeedbackApplication;
use App\Repositories\FeedbackApplicationRepository;
use DefStudio\Telegraph\Facades\Telegraph;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Throwable;

class FeedbackApplicationService
{
    public function __construct(private FeedbackApplicationRepository $feedbackApplicationRepository) {}

    public function submit(array $data): FeedbackApplication
    {
        $feedbackApplication = $this->feedbackApplicationRepository->create($data);

        $this->sendToTelegram($feedbackApplication);

        return $feedbackApplication;
    }

    public function paginateForAdmin(int $perPage = 100): LengthAwarePaginator
    {
        return $this->feedbackApplicationRepository->paginateForAdmin($perPage);
    }

    private function sendToTelegram(FeedbackApplication $feedbackApplication): void
    {
        $chatId = config('services.telegram.feedback_chat_id');

        if (blank($chatId)) {
            Log::warning('Telegram feedback chat is not configured.', [
                'feedback_application_id' => $feedbackApplication->id,
            ]);

            return;
        }

        $escape = static fn (string $value): string => htmlspecialchars(
            $value,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        );

        $message = "<b>Заявка:</b>\n"
            .'ФИО: '.$escape($feedbackApplication->name)."\n"
            .'Телефон: '.$escape($feedbackApplication->phone)."\n"
            .'Навыки: '.$escape($feedbackApplication->skills);

        try {
            Telegraph::chat((string) $chatId)
                ->message($message)
                ->send();
        } catch (Throwable $exception) {
            Log::error('Failed to send feedback application to Telegram.', [
                'feedback_application_id' => $feedbackApplication->id,
                'exception' => $exception::class,
            ]);
        }
    }
}
