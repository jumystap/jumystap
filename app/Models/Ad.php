<?php

namespace App\Models;

use App\Enums\AdStatus;
use App\Enums\AdType;
use App\Enums\PriceType;
use App\Models\Profession\Profession;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ad extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'type', 'title', 'description',
        'category_id', 'subcategory_id', 'city_id', 'address', 'is_remote',
        'price_from', 'price_to', 'price_exact', 'price_type',
        'phone', 'use_profile_phone',
        'business_type_id',
        'status', 'published_at', 'expires_at'
    ];

    protected $casts = [
        'type' => AdType::class,
        'status' => AdStatus::class,
        'price_type' => PriceType::class,
        'is_remote' => 'boolean',
        'use_profile_phone' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    protected $appends = ['formatted_price'];

    protected function phone(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $this->clearPhone($value),
        );
    }

    public function clearPhone($phone): ?string
    {
        $phone = preg_replace('/\D+/', '', str_replace('-', '', $phone));
        $length = strlen($phone);

        if ($length > 10) {
            $phone = substr($phone, $length - 10, 10);
        }else{
            return null;
        }

        return '7' . $phone;
    }


    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Profession::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Profession::class, 'subcategory_id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function businessType(): BelongsTo
    {
        return $this->belongsTo(BusinessType::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(AdPhoto::class)->orderBy('order');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(AdStatusHistory::class)->orderBy('changed_at', 'desc');
    }

    public function views(): HasMany
    {
        return $this->hasMany(AdView::class);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'ad_favorites')
            ->withTimestamps();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', AdStatus::ACTIVE->value)
            ->whereNotNull('published_at')
            ->where(function($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeServices($query)
    {
        return $query->where('type', AdType::SERVICE->value);
    }

    public function scopeProducts($query)
    {
        return $query->where('type', AdType::PRODUCT->value);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByCity($query, $cityId)
    {
        return $query->where('city_id', $cityId);
    }

    public function scopeByStatus($query, AdStatus $status)
    {
        return $query->where('status', $status->value);
    }

    // Accessors
    public function getFormattedPriceAttribute(): string
    {
        return match($this->price_type) {
            PriceType::EXACT => number_format($this->price_exact, 0, ',', ' ') . ' ₸',
            PriceType::RANGE => number_format($this->price_from, 0, ',', ' ') . ' - ' .
                number_format($this->price_to, 0, ',', ' ') . ' ₸',
            PriceType::NEGOTIABLE => 'Договорная',
            default => 'Не указана'
        };
    }

    // Methods
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function incrementContactsShown(): void
    {
        $this->increment('contacts_shown_count');
    }

    public function publish(): bool
    {
        $oldStatus = $this->status;

        $result = $this->update([
            'status' => AdStatus::ACTIVE,
            'published_at' => now()
        ]);

        if ($result) {
            $this->statusHistory()->create([
                'status_from' => $oldStatus->value,
                'status_to' => AdStatus::ACTIVE->value,
                'changed_by' => auth()->id(),
                'changed_at' => now(),
            ]);
        }

        return $result;
    }

    public function changeStatus(AdStatus $newStatus, ?string $comment = null): bool
    {
        $oldStatus = $this->status;

        $this->status = $newStatus;
        $result = $this->save();

        if ($result) {
            $this->statusHistory()->create([
                'status_from' => $oldStatus->value,
                'status_to' => $newStatus->value,
                'changed_by' => auth()->id(),
                'comment' => $comment,
                'changed_at' => now(),
            ]);
        }

        return $result;
    }

    public function canEdit(): bool
    {
        return $this->status->canEdit();
    }

    public function isPublished(): bool
    {
        return $this->status->isPublished();
    }
}
