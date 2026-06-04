# Memory: Architectural decisions (ADR-lite)

Краткий журнал архитектурных решений. Добавляй новую запись при значимом выборе.

## ADR-001: Inertia.js как мост фронт↔бэк
- **Контекст:** монолит Laravel + React без отдельного API-сервиса.
- **Решение:** server-driven SPA через Inertia; контроллеры отдают `Inertia::render`.
- **Следствие:** REST API минимален; маршруты экспортируются Ziggy; новые экраны — страницы Inertia.

## ADR-002: Service + Repository
- **Контекст:** нужно отделить бизнес-логику и доступ к данным от контроллеров.
- **Решение:** Controller → Service → Repository → Model.
- **Следствие:** контроллеры тонкие; один Service/Repository на агрегат.

## ADR-003: Отказ от стандартных слоёв Laravel (Resources/Policies/Events/Notifications)
- **Контекст:** команда выбрала более лёгкий набор абстракций.
- **Решение:** авторизация — middleware + Rule; API-ответы — трейт `ApiResponse`; уведомления —
  кастомный `NotificationService` с каналами.
- **Следствие:** не вводить эти слои без явного согласования.

## ADR-004: Мультиязычность через колонки + трейт
- **Решение:** `*_kz/*_ru/*_en` + `Multilingual`; фронт — react-i18next (ru/kz).
- **Следствие:** новые переводимые поля — по той же конвенции.

## ADR-005: Драйверы на базе БД
- **Решение:** queue/cache/session = `database` (без обязательного Redis).
- **Следствие:** в проде нужен `queue:work` и cron `schedule:run`.

## ADR-006: Модерация через Telegram-бот
- **Решение:** accept/reject вакансий через telegraph-вебхук.
- **Следствие:** `TelegramAdmin` хранит chat_id; webhook-токен — секрет.

## ADR-007: Docker без Laravel Sail
- **Решение:** собственный multi-stage `Dockerfile` + compose (app/nginx/queue/scheduler/mysql).
- **Следствие:** Sail-конфиг не используется; сборка фронта — в образе.

> Шаблон новой записи: Контекст → Решение → Следствие.
