<?php

namespace App\Models\Profession;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentImages extends Model
{
    use HasFactory;

    public function equipment()
    {
        return $this->belongsTo(ProfessionEquimpments::class, 'equipment_id');
    }
}
