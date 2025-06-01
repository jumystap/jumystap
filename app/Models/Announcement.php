<?php

namespace App\Models;

use App\Domains\Common\Enums\Status;
use App\Enums\AnnouncementStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'is_employee_found',
        'status',
        'published_at',
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
        'employment_type',
        'work_hours',
        'start_time',
        'phone'
    ];

    protected $casts = [
        'status' => AnnouncementStatus::class,
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

    public function history(): HasMany
    {
        return $this->hasMany(AnnouncementHistory::class);
    }

    public function specialization(): BelongsTo
    {
        return $this->belongsTo(Specialization::class);
    }


    public static function search(array $attributes): Builder
    {
        $query = static::query();
        $query->join('users', 'users.id', '=', 'announcements.user_id');

        if (array_key_exists('company_name', $attributes) && strlen($attributes['company_name'])) {
            $query->where('users.name', 'LIKE', '%' . $attributes['company_name'] . '%');
        }

        if (array_key_exists('user_id', $attributes) && strlen($attributes['user_id'])) {
            $query->where('users.id', $attributes['user_id']);
        }

        if (array_key_exists('title', $attributes) && strlen($attributes['title'])) {
            $query->where('title', 'LIKE', '%' . $attributes['title'] . '%');
        }

        if (array_key_exists('city', $attributes) && strlen($attributes['city'])) {
            $query->where('city', $attributes['city']);
        }

        if (array_key_exists('type', $attributes) && strlen($attributes['type'])) {
            $query->where('type_ru', $attributes['type']);
        }

        if (array_key_exists('specialization_category_id', $attributes) && strlen($attributes['specialization_category_id'])) {
            if ($attributes['specialization_category_id'] != 'null') {
                $specializationIds = Specialization::where('category_id', $attributes['specialization_category_id'])->get()->pluck('id')->toArray();
                $query->whereIn('specialization_id', $specializationIds);
            }
        }

        if (array_key_exists('status', $attributes) && strlen($attributes['status'])) {
            $query->where('announcements.status', $attributes['status']);
        }

        if (array_key_exists('with_salary', $attributes) && $attributes['with_salary'] == 'on') {
            $query->where('salary_type', '!=', 'undefined');
        }

        if (array_key_exists('no_experience', $attributes) && $attributes['no_experience'] == 'on') {
            $query->where('experience', 'Без опыта работы');
        }

        if (array_key_exists('start_date', $attributes) && $attributes['start_date']) {
            $query->where('announcements.created_at', '>=', now()->parse($attributes['start_date'])->format('Y-m-d'));
        }

        if (array_key_exists('end_date', $attributes) && $attributes['end_date']) {
            $query->where('announcements.created_at', '<=', Carbon::parse($attributes['end_date'])->endOfDay()->toDateTimeString());
        }

        return $query;
    }

}
