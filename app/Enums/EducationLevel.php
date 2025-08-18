<?php

namespace App\Enums;

enum EducationLevel: int
{
    case SECONDARY = 1;          // Среднее
    case SPECIAL_SECONDARY = 2;  // Среднее специальное
    case INCOMPLETE_HIGHER = 3;  // Неоконченное высшее
    case HIGHER = 4;             // Высшее

    /**
     * Человекочитаемые названия
     */
    public function label(): string
    {
        return match ($this) {
            self::SECONDARY => __('messages.resume.education_level.secondary'),
            self::SPECIAL_SECONDARY => __('messages.resume.education_level.secondary_special'),
            self::INCOMPLETE_HIGHER => __('messages.resume.education_level.incomplete_higher'),
            self::HIGHER => __('messages.resume.education_level.higher')
        };
    }

    /**
     * Список для select (value => label)
     */
    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }
        return $options;
    }

    /**
     * Получить enum/значение по label
     */
    public static function fromLabel(string $label): ?self
    {
        foreach (self::cases() as $case) {
            if ($case->label() === $label) {
                return $case;
            }
        }
        return null;
    }

    /**
     * Получить int значение по label
     */
    public static function valueFromLabel(string $label): ?int
    {
        return self::fromLabel($label)?->value;
    }
}
