<?php

namespace App\Models\Profession;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherSkills extends Model
{
    use HasFactory;

    public function teacher()
    {
        return $this->belongsTo(ProfessionTeachers::class, 'teacher_id');
    }
}
