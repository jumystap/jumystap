<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Profession\Profession;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'profession_id',
        'phone',
        'certificate_number',
    ];

    public function profession()
    {
        return $this->belongsTo(Profession::class, 'profession_id');
    }

    public static function search(array $attributes): Builder
    {
        $query = static::query();

        if (array_key_exists('profession_id', $attributes) && strlen($attributes['profession_id'])) {
            $query->where('profession_id', 'LIKE', '%' . $attributes['profession_id'] . '%');
        }

        if (array_key_exists('phone', $attributes) && strlen($attributes['phone'])) {
            $query->where('phone', 'LIKE', '%' . $attributes['phone'] . '%');
        }

        if (array_key_exists('certificate_number', $attributes) && strlen($attributes['certificate_number'])) {
            $query->where('certificate_number', 'LIKE', '%' . $attributes['certificate_number'] . '%');
        }

        if (array_key_exists('start_date', $attributes) && $attributes['start_date']) {
            $query->where('created_at', '>=', now()->parse($attributes['start_date'])->format('Y-m-d'));
        }

        if (array_key_exists('end_date', $attributes) && $attributes['end_date']) {
            $query->where('created_at', '<=', now()->parse($attributes['end_date'])->format('Y-m-d'));
        }

        return $query;
    }
}
