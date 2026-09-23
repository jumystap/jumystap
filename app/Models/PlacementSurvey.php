<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlacementSurvey extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'position',
        'is_graduate',
        'consent',
    ];

    protected $casts = [
        'is_graduate' => 'boolean',
        'consent' => 'boolean',
    ];
}
