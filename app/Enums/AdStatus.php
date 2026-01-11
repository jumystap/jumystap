<?php

namespace App\Enums;

enum AdStatus: string
{
    case DRAFT = 'draft';
    case MODERATION = 'moderation';
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match($this) {
            self::DRAFT => 'Черновик',
            self::MODERATION => 'На модерации',
            self::ACTIVE => 'Активно',
            self::INACTIVE => 'Неактивно',
            self::REJECTED => 'Отклонено',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::DRAFT => 'dark',
            self::MODERATION => 'warning',
            self::ACTIVE => 'success',
            self::INACTIVE => 'secondary',
            self::REJECTED => 'danger',
        };
    }

    public function badgeClass(): string
    {
        return match($this) {
            self::DRAFT => 'bg-gray-100 text-gray-800',
            self::MODERATION => 'bg-yellow-100 text-yellow-800',
            self::ACTIVE => 'bg-green-100 text-green-800',
            self::INACTIVE => 'bg-slate-100 text-slate-800',
            self::REJECTED => 'bg-red-100 text-red-800',
        };
    }

    public function isPublished(): bool
    {
        return $this === self::ACTIVE;
    }

    public function canEdit(): bool
    {
        return in_array($this, [self::DRAFT, self::REJECTED, self::INACTIVE]);
    }

    public static function options(): array
    {
        return array_map(
            fn($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
