<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_resume_id',
        'organization',
        'position_id',
        'position',
        'period',
        'responsibilities'
    ];

    public function resume()
    {
        return $this->belongsTo(UserResume::class);
    }


    public function getPeriodAttribute($value): string
    {
        if (empty($value)) {
            return $value;
        }

        $replace = app()->getLocale() === 'ru' ? 'по настоящее время' : 'осы уақытқа дейін';

        return str_replace('until_now', $replace, $value);
    }
}
