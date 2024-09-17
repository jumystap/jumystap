<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpecializationCategory extends Model
{
    use HasFactory;

    public function specialization()
    {
        return $this->hasMany(Specialization::class, 'category_id');
    }
}
