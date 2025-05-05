<?php

namespace App\Models;

use App\Enums\AnnouncementStatus;
use Illuminate\Database\Eloquent\Model;

class AnnouncementHistory extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'status' => AnnouncementStatus::class,
    ];
}
