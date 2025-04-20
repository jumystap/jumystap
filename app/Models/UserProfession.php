<?php

namespace App\Models;

use App\Models\Profession\Profession;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfession extends Model
{
    protected $guarded = ['id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function profession(): BelongsTo
    {
        return $this->belongsTo(Profession::class);
    }

    public static function search(array $attributes): Builder
    {
        $query = static::query();
        $query->join('users', 'users.id', '=', 'user_professions.user_id');

        if (array_key_exists('profession_id', $attributes) && strlen($attributes['profession_id'])) {
            $query->where('profession_id', 'LIKE', '%' . $attributes['profession_id'] . '%');
        }

        if (array_key_exists('name', $attributes) && strlen($attributes['name'])) {
            $query->where('users.name', 'LIKE', '%' . $attributes['name'] . '%');
        }

        if (array_key_exists('phone', $attributes) && strlen($attributes['phone'])) {
            $query->where('users.phone', 'LIKE', '%' . $attributes['phone'] . '%');
        }

        if (array_key_exists('certificate_number', $attributes) && strlen($attributes['certificate_number'])) {
            $query->where('certificate_number', 'LIKE', '%' . $attributes['certificate_number'] . '%');
        }

        if (array_key_exists('start_date', $attributes) && $attributes['start_date']) {
            $query->where('user_professions.created_at', '>=', now()->parse($attributes['start_date'])->format('Y-m-d'));
        }

        if (array_key_exists('end_date', $attributes) && $attributes['end_date']) {
            $query->where('user_professions.created_at', '<=', Carbon::parse($attributes['end_date'])->endOfDay()->toDateTimeString());
        }

        return $query;
    }
}
