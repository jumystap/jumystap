<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class AnalyticByClick extends Model
{
    protected $guarded = ['id'];

    public function parameter()
    {
        return $this->belongsTo(AnalyticParameter::class);
    }

    public static function search(array $attributes): Builder
    {
        $query = static::query();

        if (array_key_exists('parameter_id', $attributes) && strlen($attributes['parameter_id'])) {
            $query->where('parameter_id', 'LIKE', '%' . $attributes['parameter_id'] . '%');
        }

        if (array_key_exists('start_date', $attributes) && $attributes['start_date']) {
            $query->where('created_at', '>=', now()->parse($attributes['start_date'])->format('Y-m-d'));
        }

        if (array_key_exists('end_date', $attributes) && $attributes['end_date']) {

            $query->where('created_at', '<=', Carbon::parse($attributes['end_date'])->endOfDay()->toDateTimeString());
        }

        return $query;
    }
}
