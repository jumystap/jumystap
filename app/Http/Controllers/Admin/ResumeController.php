<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DrivingLicenseCategory;
use App\Enums\EducationLevel;
use App\Enums\EmploymentType;
use App\Enums\ResumeStatus;
use App\Enums\WorkSchedule;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Resume\UpdateResumeRequest;
use App\Models\UserResume;
use App\Services\ResumeService;
use Exception;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResumeController extends Controller
{
    public function __construct(private ResumeService $resumeService)
    {
    }

    public function index(Request $request): View
    {
        $filters  = $request->only(['status', 'city', 'search']);
        $resumes  = $this->resumeService->getForModeration($filters, 20);
        $statuses = ResumeStatus::cases();

        return view('admin.resumes.index', compact('resumes', 'statuses'));
    }

    public function show(UserResume $resume): View
    {
        $resume->load([
            'user',
            'organizations',
            'languages',
            'statusHistory.changedBy',
        ]);

        return view('admin.resumes.show', compact('resume'));
    }

    public function edit(UserResume $resume): View
    {
        $resume->load(['organizations', 'languages']);

        $statuses        = ResumeStatus::cases();
        $employmentTypes = EmploymentType::options();
        $workSchedules   = WorkSchedule::options();
        $educationLevels = EducationLevel::options();
        $drivingLicenses = DrivingLicenseCategory::options();

        return view('admin.resumes.edit', compact(
            'resume',
            'statuses',
            'employmentTypes',
            'workSchedules',
            'educationLevels',
            'drivingLicenses'
        ));
    }

    public function update(UpdateResumeRequest $request, UserResume $resume): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $oldStatus = $resume->status;
            $data      = $request->validated();

            $statusComment = $data['status_comment'] ?? null;
            unset($data['status_comment']);

            // Checkboxes are absent from the payload when unchecked.
            $data['has_car']   = $request->boolean('has_car');
            $data['ip_status'] = $request->boolean('ip_status');

            $resume->update($data);

            // Record history only when the status actually changed. Admin
            // content edits are trusted and do NOT send a resume back to
            // moderation (unlike an owner edit on the public side).
            if ($oldStatus->value !== $resume->status->value) {
                $resume->statusHistory()->create([
                    'status_from' => $oldStatus->value,
                    'status_to'   => $resume->status->value,
                    'changed_by'  => auth()->id(),
                    'comment'     => $statusComment,
                    'changed_at'  => now(),
                ]);

                if ($resume->status === ResumeStatus::ACTIVE) {
                    $resume->update([
                        'published_at'  => $resume->published_at ?? now(),
                        'reject_reason' => null,
                    ]);
                }

                if ($resume->status === ResumeStatus::REJECTED) {
                    $resume->update(['reject_reason' => $statusComment]);
                }
            }

            DB::commit();

            return redirect()
                ->route('admin.resumes.show', $resume)
                ->with('success', 'Резюме успешно обновлено');
        } catch (Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Ошибка при обновлении резюме: ' . $e->getMessage());
        }
    }

    public function approve(UserResume $resume): RedirectResponse
    {
        if ($this->resumeService->approve($resume)) {
            return back()->with('success', 'Резюме одобрено и опубликовано');
        }

        return back()->with('error', 'Ошибка при одобрении');
    }

    public function reject(Request $request, UserResume $resume): RedirectResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        if ($this->resumeService->reject($resume, $request->reason)) {
            return back()->with('success', 'Резюме отклонено');
        }

        return back()->with('error', 'Ошибка при отклонении');
    }

    public function destroy(UserResume $resume): RedirectResponse
    {
        try {
            $resume->delete();

            return redirect()
                ->route('admin.resumes.index')
                ->with('success', 'Резюме удалено');
        } catch (Exception $e) {
            return back()->with('error', 'Ошибка при удалении: ' . $e->getMessage());
        }
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $request->validate([
            'resumes'   => 'required|array',
            'resumes.*' => 'exists:user_resumes,id',
            'action'    => 'required|in:approve,reject,delete',
        ]);

        try {
            DB::beginTransaction();

            $resumes = UserResume::whereIn('id', $request->resumes)->get();

            foreach ($resumes as $resume) {
                match ($request->action) {
                    'approve' => $this->resumeService->approve($resume),
                    'reject'  => $this->resumeService->reject($resume, 'Массовое отклонение'),
                    'delete'  => $resume->delete(),
                };
            }

            DB::commit();

            return back()->with('success', 'Действие выполнено для ' . count($resumes) . ' резюме');
        } catch (Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Ошибка при выполнении действия');
        }
    }
}
