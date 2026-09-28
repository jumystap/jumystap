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
        'found_via_site',
        'is_graduate',
        'consent',
    ];

    protected $casts = [
        'found_via_site' => 'boolean',
        'is_graduate' => 'boolean',
        'consent' => 'boolean',
    ];
}
