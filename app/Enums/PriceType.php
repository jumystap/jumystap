<?php

namespace App\Enums;

enum PriceType: string
{
    case EXACT = 'exact';
    case RANGE = 'range';
    case NEGOTIABLE = 'negotiable';

    public function label(): string
    {
        return match($this) {
            self::EXACT => 'Точная цена',
            self::RANGE => 'Диапазон',
            self::NEGOTIABLE => 'Договорная',
        };
    }

    public function requiresExactPrice(): bool
    {
        return $this === self::EXACT;
    }

    public function requiresRange(): bool
    {
        return $this === self::RANGE;
    }

    public static function options(): array
    {
        return array_map(
            fn($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
