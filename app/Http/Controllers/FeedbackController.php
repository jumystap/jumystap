<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
}
