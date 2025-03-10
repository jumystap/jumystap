<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserResume extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'city', 'district', 'education', 'faculty', 'specialization', 'graduation_year', 'ip_status', 'desired_field', 'skills', 'photo_path'
    ];

    protected $casts = [
        'skills' => 'array',
    ];

    public function organizations()
    {
        return $this->hasMany(Organization::class);
    }

    public function languages()
    {
        return $this->hasMany(Language::class);
    }
}
