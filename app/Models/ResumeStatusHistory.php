<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResumeStatusHistory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_resume_id', 'status_from', 'status_to',
        'changed_by', 'comment', 'changed_at',
    ];

    protected $casts = ['changed_at' => 'datetime'];

    public function resume(): BelongsTo
    {
        return $this->belongsTo(UserResume::class, 'user_resume_id');
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
