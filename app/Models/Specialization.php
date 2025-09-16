<?php

namespace App\Models;

use App\Traits\Multilingual;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Specialization extends Model
{
    use HasFactory;
    use Multilingual;

    protected $guarded = ['id'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(SpecializationCategory::class, 'category_id');
    }

    public function resumes()
    {
        return $this->hasMany(ResumeSpecialization::class);
    }
}
