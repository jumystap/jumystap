<?php

namespace App\Http\Middleware;

use App\Models\AnnouncementVisit;
use App\Models\Visit;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Jenssegers\Agent\Agent;

class TrackVisits
{
    public function handle(Request $request, Closure $next)
    {
        $userId = Auth::check() ? Auth::id() : null;
        $agent = new Agent();
        $deviceType = $agent->isMobile() ? 'mobile' : 'desktop';
        $url = $request->fullUrl();
        $ip = $request->ip();

        $response = $next($request);

        app()->terminating(function () use ($userId, $url, $ip, $deviceType) {
            try {
                Visit::create([
                    'user_id' => $userId,
                    'url' => $url,
                    'ip_address' => $ip,
                    'device_type' => $deviceType,
                ]);

                // Дополнительно фиксируем просмотр вакансии в отдельной таблице
                // (чистый источник с индексируемым announcement_id). Якорим regex,
                // чтобы /profile/announcement/{id} (просмотр работодателем своей
                // аналитики) сюда не попадал. insertOrIgnore — чтобы заход на
                // несуществующую вакансию (боты/битые ссылки) молча отсекался по FK,
                // а не сыпал пойманными исключениями в логи на обычном трафике.
                if (preg_match('#^https?://[^/]+/announcement/(\d+)#', $url, $matches)) {
                    AnnouncementVisit::insertOrIgnore([[
                        'announcement_id' => (int) $matches[1],
                        'user_id' => $userId,
                        'ip_address' => $ip,
                        'device_type' => $deviceType,
                        'created_at' => now()->toDateTimeString(),
                    ]]);
                }
            } catch (\Throwable $e) {
                report($e);
            }
        });

//        TrackVisitJob::dispatch($user, $request->fullUrl(), $request->ip(), $deviceType);

        return $response;
    }
}
