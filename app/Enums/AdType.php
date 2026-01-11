<?php

namespace App\Enums;

enum AdType: string
{
    case SERVICE = 'service';
    case PRODUCT = 'product';

    public function label(): string
    {
        return match($this) {
            self::SERVICE => 'Услуга',
            self::PRODUCT => 'Товар',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::SERVICE => 'briefcase',
            self::PRODUCT => 'shopping-bag',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
