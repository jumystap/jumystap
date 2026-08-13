<?php

namespace App\Models;

use App\Enums\DrivingLicenseCategory;
use App\Enums\EducationLevel;
use App\Enums\EmploymentType;
use App\Enums\ResumeStatus;
use App\Enums\WorkSchedule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserResume extends Model
{
    use HasFactory;

    protected $fillable = [
        'position',
        'email',
        'phone',
        'user_id',
        'city',
        'district',
        'salary',
        'employment_type_id',
        'work_schedule_id',
        'education_level_id',
        'educational_institution',
        'faculty',
        'graduation_year',
        'ip_status',
        'has_car',
        'driving_license',
        'skills',
        'about',
        'status',
        'reject_reason',
        'published_at',
    ];

    protected $casts = [
        'skills' => 'array',
        'status' => ResumeStatus::class,
        'published_at' => 'datetime',
    ];

    protected $appends = [
        'employment_type',
        'work_schedule',
        'formatted_salary',
        'education_level',
        'driving_license_title',
    ];

    public function getEmploymentTypeAttribute(): string
    {
        return $this->employment_type_id ? EmploymentType::from($this->employment_type_id)->label() : '';
    }

    public function getWorkScheduleAttribute(): string
    {
        return $this->work_schedule_id ? WorkSchedule::from($this->work_schedule_id)->label() : '';
    }

    public function getFormattedSalaryAttribute(): string
    {
        return $this->salary ? number_format($this->salary, 0, '.', ' ') : '';
    }

    public function getEducationLevelAttribute(): string
    {
        return $this->education_level_id ? EducationLevel::from($this->education_level_id)->label() : '';
    }

    public function getDrivingLicenseTitleAttribute(): string
    {
        return $this->driving_license ? DrivingLicenseCategory::from($this->driving_license)->label() : '';
    }

    public function organizations(): HasMany
    {
        return $this->hasMany(Organization::class, 'user_resume_id');
    }

    public function languages(): HasMany
    {
        return $this->hasMany(Language::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function specializations(): HasMany
    {
        return $this->hasMany(ResumeSpecialization::class, 'resume_id');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(ResumeStatusHistory::class, 'user_resume_id')->orderBy('changed_at', 'desc');
    }

    public function scopeActive($query)
    {
        return $query->where('status', ResumeStatus::ACTIVE->value);
    }

    public function scopeByStatus($query, ResumeStatus $status)
    {
        return $query->where('status', $status->value);
    }

    public function changeStatus(ResumeStatus $newStatus, ?string $comment = null): bool
    {
        $oldStatus = $this->status;

        $this->status = $newStatus;
        $result = $this->save();

        if ($result) {
            $this->statusHistory()->create([
                'status_from' => $oldStatus?->value,
                'status_to'   => $newStatus->value,
                'changed_by'  => auth()->id(),
                'comment'     => $comment,
                'changed_at'  => now(),
            ]);
        }

        return $result;
    }

    public function isPublished(): bool
    {
        return $this->status?->isPublished() ?? false;
    }
}
