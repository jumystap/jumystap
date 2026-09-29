<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnouncementAdress extends Model
{
    use HasFactory;

    protected $fillable = [
        'announcement_id',
        'adress',
        'latitude',
        'longitude',
    ];

    /**
     * Отдаём координаты числами, а не строками: decimal-колонки Eloquent
     * по умолчанию приводит к string, и на фронте ymaps получал ["43.2", "76.9"]
     * вместо чисел.
     */
    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];
}
