<?php

namespace App\Http\Controllers;

use DefStudio\Telegraph\Facades\Telegraph;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class FeedbackController extends Controller
{
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

    public function sendTelegramFeedback(Request $request)
    {
        $validated = $request->validate([
            'type'    => 'required|in:application,complaint',
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:30',
            'items'   => 'required|array|min:1',
            'items.*' => 'string|max:255',
            'reason'  => 'nullable|string|max:2000',
        ]);

        $e = fn ($value) => htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');

        if ($validated['type'] === 'application') {
            $message = "<b>Заявка:</b>\n"
                . 'ФИО: ' . $e($validated['name']) . "\n"
                . 'Телефон: ' . $e($validated['phone']) . "\n"
                . 'Профессия: ' . $e(implode(', ', $validated['items']));
        } else {
            $message = "<b>Жалоба:</b>\n"
                . 'ФИО: ' . $e($validated['name']) . "\n"
                . 'Телефон: ' . $e($validated['phone']) . "\n"
                . 'Причина: ' . $e(implode(', ', $validated['items'])) . "\n"
                . 'Текст: ' . $e($validated['reason'] ?? '');
        }

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
