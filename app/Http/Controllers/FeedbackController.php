<?php

namespace App\Http\Controllers;

use App\Http\Requests\Feedback\SendTelegramFeedbackRequest;
use App\Services\FeedbackApplicationService;
use DefStudio\Telegraph\Facades\Telegraph;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class FeedbackController extends Controller
{
    public function __construct(private FeedbackApplicationService $feedbackApplicationService) {}

    public function sendFeedback(Request $request)
    {
        $request->validate([
            'feedback' => 'required|string',
        ]);

        $feedback = $request->input('feedback');

        Mail::raw($feedback, function ($message) {
            $message->to('agalimzhan928@gmail.com')
                ->subject('New Feedback');
        });

        return response()->json(['message' => 'Feedback sent successfully'], 200);
    }

    public function sendTelegramFeedback(SendTelegramFeedbackRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if ($validated['type'] === 'application') {
            $this->feedbackApplicationService->submit([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'skills' => implode(', ', $validated['items']),
            ]);

            return response()->json([
                'message' => 'Sent successfully',
            ]);
        }

        $e = fn ($value) => htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');

        $message = "<b>Жалоба:</b>\n"
            .'ФИО: '.$e($validated['name'])."\n"
            .'Телефон: '.$e($validated['phone'])."\n"
            .'Причина: '.$e(implode(', ', $validated['items']))."\n"
            .'Текст: '.$e($validated['reason'] ?? '');

        try {
            Telegraph::chat(config('services.telegram.feedback_chat_id'))
                ->message($message)
                ->send();
        } catch (\Exception $exception) {
            Log::error('Failed to send telegram feedback.', ['error' => $exception->getMessage()]);

            return response()->json(['message' => 'Failed to send'], 502);
        }

        return response()->json(['message' => 'Sent successfully']);
    }
}
