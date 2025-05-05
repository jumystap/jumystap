<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Observers\AnnouncementObserver;
use App\Services\Notification\Channels\SmsChannel;
use App\Services\Notification\Channels\SmscChannel;
use Illuminate\Pagination\Paginator;
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
        $this->app->bind(SmsChannel::class, SmscChannel::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Paginator::defaultView('vendor.pagination.bootstrap-4');

        // Получаем локаль из сессии или запроса
        $locale = request()->header('X-Locale', Session::get('locale', config('app.locale')));

        // Устанавливаем локаль приложения
        App::setLocale($locale);

        Announcement::observe(AnnouncementObserver::class);
    }
}
