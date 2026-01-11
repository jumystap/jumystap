<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessType extends Model
{
    protected $fillable = ['name', 'name_kz'];

    public function ads(): HasMany
    {
        return $this->hasMany(Ad::class);
    }

}
