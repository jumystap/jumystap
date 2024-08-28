<?php

namespace App\Models\Profession;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profession extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'group_id',
        'name_kz',
        'name_ru',
        'release_count',
        'icon_url',
    ];

    /**
     * Get the group that this profession belongs to.
     */
    public function group()
    {
        return $this->belongsTo(GroupProfession::class, 'group_id');
    }

    public function skills()
    {
        return $this->hasMany(ProfessionSkills::class);
    }

    public function images()
    {
        return $this->hasMany(ProfessionImages::class);
    }

    public function teachers()
    {
        return $this->hasMany(ProfessionTeachers::class);
    }

    public function equipments()
    {
        return $this->hasMany(ProfessionEquimpments::class);
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
