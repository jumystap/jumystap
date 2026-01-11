<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ad_id', 'user_id', 'ip_address',
        'user_agent', 'viewed_at'
    ];

    protected $casts = ['viewed_at' => 'datetime'];

    public function ad(): BelongsTo
    {
        return $this->belongsTo(Ad::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
