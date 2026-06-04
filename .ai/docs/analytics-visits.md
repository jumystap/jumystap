# Module: Analytics & Visits

## Назначение
Трекинг посещений сайта и кликов по параметрам для аналитики.

## Ключевые файлы
- Middleware: `app/Http/Middleware/TrackVisits.php` — на каждый web-запрос пишет `Visit`
  (user_id|null, url, ip, device_type через jenssegers/agent) в `terminating()`-колбэке.
- Job: `app/Jobs/TrackVisitJob.php` (`ShouldQueue`) — альтернативная асинхронная запись визита.
  ⚠️ Сейчас в middleware используется синхронная запись, постановка job закомментирована.
- Клик-аналитика: `AnalyticController@create` (`POST analytics/click`), модели `AnalyticByClick`,
  `AnalyticParameter`; сидер `AnalyticParameterSeeder`.
- Сервис/репозиторий: `AnalyticsService`/`AnalyticsRepository` (метрики пользователей,
  демография, возраст, выпускники).
- Админ: `Admin\AnalyticController@clicks` (`admin/analytics/clicks`), Blade
  `resources/views/admin/analytics/*`.

## Заметки
- Внешняя аналитика (GTM, Яндекс.Метрика) подключена в `resources/views/app.blade.php`.
- При высоком трафике синхронная запись `Visit` нагружает запросы — кандидат на перевод в очередь
  (`TrackVisitJob`). См. `.ai/memory/known-limitations.md`.
