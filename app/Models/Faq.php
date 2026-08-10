<?php

namespace App\Models;

use App\Traits\Multilingual;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use Multilingual;

    protected $fillable = [
        'question_ru',
        'question_kz',
        'answer_ru',
        'answer_kz',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'answer_ru' => 'array',
        'answer_kz' => 'array',
        'is_active' => 'boolean',
    ];
}
