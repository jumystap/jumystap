# Module: Telegram moderation

## Назначение
Модерация вакансий и уведомления админов через Telegram-бот (defstudio/telegraph).

## Ключевые файлы
- Хендлер: `app/Telegram/Handler.php`.
- Вебхук: `POST /telegram/webhook` (`routes/web.php`, `Telegraph::handleWebhook()`).
- Конфиг: `config/telegraph.php` (file/cache storage, webhook `/telegraph/{token}/webhook`).
- Модель: `TelegramAdmin` (chat_id, username зарегистрированных админов).

## Команды/коллбеки
- `/start` — регистрирует `TelegramAdmin` по chat_id + username.
- `/help` — заглушка.
- `accept` (callback с id+chat_id) — `Announcement` → `ACTIVE`, `published_at = now()`, лог + ответ.
- `reject` — `Announcement` → `BLOCKED`, лог + ответ.
- Неизвестная команда — «Неизвестная команда».

## Поток
Новая вакансия → уведомление зарегистрированным `TelegramAdmin` → модератор жмёт accept/reject →
статус объявления меняется.

## Безопасность
- Обрабатывать только ожидаемые команды/коллбеки (уже реализовано). Webhook-токен — секрет.
