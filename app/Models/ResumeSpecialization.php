<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResumeSpecialization extends Model
{
    use HasFactory;

    protected $fillable = [
        'resume_id',
        'specialization_id',
    ];
}
