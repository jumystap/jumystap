<?php

namespace App\Models;

use App\Traits\Multilingual;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdCategory extends Model
{
    use Multilingual;

    protected $guarded = ['id'];

    public function ads(): HasMany
    {
        return $this->hasMany(Ad::class);
    }
}
