<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Response extends Model
{
    use HasFactory;

    protected $table = 'responses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'announcement_id',
        'employee_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function announcement(): BelongsTo
    {
        return $this->belongsTo(Announcement::class, 'announcement_id');
    }

    public static function search(array $attributes): Builder
    {
        $query = static::query()->whereNotNull('announcement_id');

        if (array_key_exists('start_date', $attributes) && $attributes['start_date']) {
            $query->where('created_at', '>=', now()->parse($attributes['start_date'])->format('Y-m-d'));
        }

        if (array_key_exists('end_date', $attributes) && $attributes['end_date']) {
            $query->where('created_at', '<=', Carbon::parse($attributes['end_date'])->endOfDay()->toDateTimeString());
        }

        return $query;
    }
}
