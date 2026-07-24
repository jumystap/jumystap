<?php

namespace App\Enums;

enum ResumeStatus: string
{
    case MODERATION = 'moderation';
    case ACTIVE = 'active';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match($this) {
            self::MODERATION => 'На модерации',
            self::ACTIVE => 'Опубликовано',
            self::REJECTED => 'Отклонено',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::MODERATION => 'warning',
            self::ACTIVE => 'success',
            self::REJECTED => 'danger',
        };
    }

    public function badgeClass(): string
    {
        return match($this) {
            self::MODERATION => 'bg-yellow-100 text-yellow-800',
            self::ACTIVE => 'bg-green-100 text-green-800',
            self::REJECTED => 'bg-red-100 text-red-800',
        };
    }

    public function isPublished(): bool
    {
        return $this === self::ACTIVE;
    }

    public static function options(): array
    {
        return array_map(
            fn($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
