<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $table = 'announcements';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type_kz',
        'type_ru',
        'title',
        'description',
        'payment_type',
        'cost',
        'active',
        'payment_status',
        'payed_until',
        'location',
        'work_time',
        'city',
        'industry_id',
        'salary_type',
        'cost_min',
        'cost_max',
        'specialization_id',
    ];

    /**
     * Get the group that this profession belongs to.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function responses()
    {
        return $this->hasMany(Response::class);
    }
}
