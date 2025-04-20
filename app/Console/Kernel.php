<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('app:get-certificates work')->dailyAt('00:01');
        $schedule->command('app:get-certificates digital')->dailyAt('01:01');
        $schedule->command('app:delete-certificates work')->dailyAt('02:01');
        $schedule->command('app:delete-certificates digital')->dailyAt('03:01');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
