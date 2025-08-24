<?php

namespace App\Enums;

enum DrivingLicenseCategory: int
{
    case NONE = 0;
    case A = 1;
    case B = 2;
    case C = 3;
    case D = 4;
    case BE = 5;
    case CE = 6;
    case DE = 7;
    case TM = 8;
    case TB = 9;

    /**
     * Человекочитаемые переводы (можно вынести в lang)
     */
    public function label(): string
    {
        return match ($this) {
            self::NONE => __('messages.resume.driving_license_category.category_none'),
            self::A => __('messages.resume.driving_license_category.category_a'),
            self::B => __('messages.resume.driving_license_category.category_b'),
            self::C => __('messages.resume.driving_license_category.category_c'),
            self::D => __('messages.resume.driving_license_category.category_d'),
            self::BE => __('messages.resume.driving_license_category.category_be'),
            self::CE => __('messages.resume.driving_license_category.category_ce'),
            self::DE => __('messages.resume.driving_license_category.category_de'),
            self::TM => __('messages.resume.driving_license_category.category_tm'),
            self::TB => __('messages.resume.driving_license_category.category_tb'),
        };
    }

    /**
     * Получить список для <select>
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
