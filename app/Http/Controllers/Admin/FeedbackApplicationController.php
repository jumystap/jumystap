<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FeedbackApplicationService;
use Illuminate\Contracts\View\View;

class FeedbackApplicationController extends Controller
{
    public function __construct(private FeedbackApplicationService $feedbackApplicationService) {}

    public function index(): View
    {
        return view('admin.feedback-applications.index', [
            'feedbackApplications' => $this->feedbackApplicationService->paginateForAdmin(),
        ]);
    }
}
