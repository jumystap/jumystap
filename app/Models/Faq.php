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
        'is_active' => 'boolean',
    ];
}
