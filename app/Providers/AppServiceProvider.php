<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Models\User;
use App\Observers\AnnouncementObserver;
use App\Observers\UserObserver;
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

        $locale = request()->header('X-Locale', session('locale', config('app.locale')));
        $locale = $locale === 'kz' ? 'kk' : $locale;
        app()->setLocale($locale);
        session(['locale' => $locale]);

        Announcement::observe(AnnouncementObserver::class);
        User::observe(UserObserver::class);
    }
}
