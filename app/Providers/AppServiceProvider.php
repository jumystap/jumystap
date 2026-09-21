<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Models\User;
use App\Observers\AnnouncementObserver;
use App\Observers\UserObserver;
use App\Services\Notification\Channels\SmsChannel;
use App\Services\Notification\Channels\SmscChannel;
use Illuminate\Pagination\Paginator;
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

        // When no language is specified (no X-Locale header / locale cookie, or
        // an empty value), default the backend — including validation messages —
        // to Russian rather than the app's `en` fallback.
        $locale = request()->header('X-Locale')
            ?: request()->cookie('locale')
            ?: 'ru';
        $locale = in_array($locale, ['kz', 'kk']) ? 'kk' : $locale;
        app()->setLocale($locale);

        Announcement::observe(AnnouncementObserver::class);
        User::observe(UserObserver::class);
    }
}
