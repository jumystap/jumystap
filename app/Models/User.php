<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\Roles;
use App\Models\Profession\Profession;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected static function booted()
    {
        static::deleting(function ($user) {
            // Soft delete all related announcements
            $user->announcement()->delete();
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
        'password',
        'image_url',
        'role_id',
        'work_status',
        'work_status_kz',
        'status',
        'status_kz',
        'ip',
        'age',
        'ip_kz',
        'rating',
        'date_of_birth',
        'profession_id',
        'description',
        'rating_count',
        'source',
        'is_graduate',
        'is_blocked',
        'fixed'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'phone_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * Get users by role name
     *
     * @param string $roleName
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUsersByRoleName(string $roleName)
    {
        $role = Role::where('name', $roleName)->first();

        return $role ? self::where('role_id', $role->id)
            : self::query()->whereRaw('1 = 0');
    }

    /**
     * Get users by work status
     *
     * @param string $workStatus
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUsersByWorkStatus(string $workStatus)
    {
        $role = Role::where('name', 'employee')->first();

        return $role ? self::where('work_status', $workStatus)
            ->where('role_id', $role->id)
            : self::query()->whereRaw('1 = 0');
    }

    /**
     * Get the role of user
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the profession of user
     */
    public function profession()
    {
        return $this->belongsTo(Profession::class);
    }

    public function professions(): BelongsToMany
    {
        return $this->belongsToMany(Profession::class, 'user_professions', 'user_id', 'profession_id');
    }

    public function portfolio()
    {
        return $this->hasMany(Portfolio::class);
    }

    public function announcement()
    {
        return $this->hasMany(Announcement::class);
    }

    public function response(): HasMany
    {
        return $this->hasMany(Response::class, 'employee_id', 'id');
    }

    public function hasRole(Roles $role):bool
    {
        return $this->role_id === $role->value;
    }

    public static function search(array $attributes): Builder
    {
        $query = static::query();

        if (array_key_exists('name', $attributes) && strlen($attributes['name'])) {
            $query->where('name', 'LIKE', '%' . $attributes['name'] . '%');
        }

        if (array_key_exists('phone', $attributes) && strlen($attributes['phone'])) {
            $query->where('phone', 'LIKE', '%' . $attributes['phone'] . '%');
        }

        if (array_key_exists('email', $attributes) && strlen($attributes['email'])) {
            $query->where('email', 'LIKE', '%' . $attributes['email'] . '%');
        }

        if (array_key_exists('role_id', $attributes) && strlen($attributes['role_id'])) {
            $roleId = (int)$attributes['role_id'];

            if($roleId === Roles::NON_GRADUATE->value){
                $query->where('role_id', Roles::EMPLOYEE->value);
            }else {
                $query->where('role_id', $roleId);
            }

            if($roleId === Roles::EMPLOYEE->value){
                $query->where('users.is_graduate', true);
            }
        }

        if (array_key_exists('roles_id', $attributes) && count($attributes['roles_id'])) {
            $query->whereIn('role_id', $attributes['roles_id']);
        }

        if (array_key_exists('start_date', $attributes) && $attributes['start_date']) {
            $query->where('created_at', '>=', now()->parse($attributes['start_date'])->format('Y-m-d'));
        }

        if (array_key_exists('end_date', $attributes) && $attributes['end_date']) {
            $query->where('created_at', '<=', Carbon::parse($attributes['end_date'])->endOfDay()->toDateTimeString());
        }

//        if (array_key_exists('is_graduate', $attributes) && $attributes['is_graduate'] == 'on') {
//            $query->where('users.is_graduate', true);
//        }

        return $query;
    }
}
