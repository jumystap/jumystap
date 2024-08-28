<?php

namespace App\Models\Profession;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessionEquimpments extends Model
{
    use HasFactory;

    protected $table = "profession_equipments";

    public function profession()
    {
        return $this->belongsTo(Profession::class);
    }

    public function details()
    {
        return $this->hasMany(EquipmentDetails::class, 'equipment_id');
    }

    public function images()
    {
        return $this->hasMany(EquipmentImages::class, 'equipment_id');
    }
}
