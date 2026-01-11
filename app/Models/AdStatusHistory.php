<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdStatusHistory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ad_id', 'status_from', 'status_to',
        'changed_by', 'comment', 'changed_at'
    ];

    protected $casts = ['changed_at' => 'datetime'];

    public function ad(): BelongsTo
    {
        return $this->belongsTo(Ad::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
