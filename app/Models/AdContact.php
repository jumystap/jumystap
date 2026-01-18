<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdContact extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ad_id', 'user_id', 'ip_address',
        'user_agent', 'contacted_at'
    ];

    protected $casts = ['contacted_at' => 'datetime'];

    public function ad(): BelongsTo
    {
        return $this->belongsTo(Ad::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
