<?php

namespace App\Models\Profession;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupProfession extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Get all professions under this group.
     */
    public function professions()
    {
        return $this->hasMany(Profession::class, 'group_id');
    }
}
