<?php

namespace App\Models\Profession;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessionImages extends Model
{
    use HasFactory;

    public function profession()
    {
        return $this->belongsTo(Profession::class);
    }
}
