<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class AdPhoto extends Model
{
    protected $fillable = ['ad_id', 'path', 'thumbnail_path', 'order', 'is_primary'];

    protected $casts = [
        'is_primary' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['url', 'thumbnail_url'];

    public function ad(): BelongsTo
    {
        return $this->belongsTo(Ad::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::url($this->path);
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->thumbnail_path ? Storage::url($this->thumbnail_path) : null;
    }

}
