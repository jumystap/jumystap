<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public static function get(string $key, $default = null)
    {
        try {
            $value = Cache::rememberForever(
                "setting.$key",
                fn () => static::query()->where('key', $key)->value('value')
            );
        } catch (\Throwable $e) {
            return $default;
        }

        return $value ?? $default;
    }

    public static function getBool(string $key, bool $default = false): bool
    {
        $value = static::get($key);

        return $value === null ? $default : filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    public static function set(string $key, $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("setting.$key");
    }
}
