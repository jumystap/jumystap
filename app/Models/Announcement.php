<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;

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
        'is_top',
        'is_urgent',
        'active',
        'payment_status',
        'payed_until',
        'work_time',
        'city',
        'industry_id',
        'salary_type',
        'cost_min',
        'cost_max',
        'specialization_id',
        'experience',
        'education',
        'employemnt_type',
        'work_hours',
        'start_time',
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

    public function address()
    {
        return $this->hasMany(AnnouncementAdress::class);
    }

    public function conditions()
    {
        return $this->hasMany(AnnouncementCondition::class);
    }

    public function requirements()
    {
        return $this->hasMany(AnnouncementRequirement::class);
    }

    public function responsibilities()
    {
        return $this->hasMany(AnnouncementResponsibility::class);
    }
}
