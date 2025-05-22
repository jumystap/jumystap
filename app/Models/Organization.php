<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = ['resume_id', 'organization', 'position_id', 'position', 'period'];

    public function resume()
    {
        return $this->belongsTo(UserResume::class);
    }
}
