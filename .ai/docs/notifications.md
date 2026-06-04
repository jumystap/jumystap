# Module: Notifications

## Назначение
Отправка уведомлений пользователям по разным каналам (SMS, Email) — кастомная реализация, НЕ
стандартные Laravel Notifications.

## Ключевые файлы
- Сервис: `app/Services/Notification/NotificationService.php`.
- Каналы: `app/Services/Notification/Channels/` (`SmscChannel`, `EmailChannel`, `SmsChannel`).
- Enum: `App\Enums\NotificationChannel`.
- Конфиг провайдеров: `config/services.php` (smsc), `config/mail.php`.

## Важно
- В проекте **нет** `app/Notifications/` и `app/Mail/` в стандартном виде — используется этот
  кастомный сервис с каналами. Не вводи стандартные Notification/Mailable без согласования —
  следуй существующему паттерну.
- SMS-коды верификации идут через SMSC (см. также `.ai/docs/authentication.md`).

## TODO / уточнить
- Полный список событий, на которые шлются уведомления, и шаблоны сообщений — сверить в
  `NotificationService` и его вызовах.
