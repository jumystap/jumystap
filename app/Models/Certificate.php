<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Profession\Profession;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'profession_id',
        'phone',
        'certificate_number',
    ];

    public function profession()
    {
        return $this->belongsTo(Profession::class, 'profession_id');
    }
}
