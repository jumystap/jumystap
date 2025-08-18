<?php

namespace App\Models;

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
        'about'
    ];

    protected $casts = [
        'skills' => 'array',
    ];

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
}
