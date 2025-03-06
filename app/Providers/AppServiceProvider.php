<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Получаем локаль из сессии или запроса
        $locale = request()->header('X-Locale', Session::get('locale', config('app.locale')));

        // Устанавливаем локаль приложения
        App::setLocale($locale);
    }
}
