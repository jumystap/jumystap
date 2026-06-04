# Memory: Project decisions

Зафиксированные решения проекта (наблюдаемые из кода). Обновляй при новых решениях.

- **Inertia вместо REST.** Фронт↔бэк — через Inertia (props + router); `routes/api.php` минимален.
  Новые экраны делать страницами Inertia, а не REST+SPA-роутером.
- **Service + Repository.** Бизнес-логика — в Services, запросы — в Repositories. Контроллеры тонкие.
- **Без Resources/Policies/Events/DTO/Actions.** Эти слои сознательно отсутствуют. Авторизация —
  middleware + проверки ролей + Rule (`CheckAnnouncementAuthor`). API-ответы — трейт `ApiResponse`.
- **Кастомные уведомления.** Вместо Laravel Notifications/Mailables — `Notification\NotificationService`
  с каналами SMS/Email/SMSC.
- **Модерация через Telegram.** Вакансии одобряются/отклоняются ботом (`app/Telegram/Handler.php`).
- **Драйверы `database`.** Очередь, кэш, сессии — на БД (Redis не обязателен).
- **Мультиязычность по колонкам.** `*_kz/*_ru/*_en` + трейт `Multilingual`; фронт — react-i18next
  (ru/kz). Локаль `kk` нормализуется в `kz`.
- **MySQL — рабочая СУБД.** `DB_CONNECTION=mysql`; `config/database.php` default `sqlite` — игнорировать.
- **Docker без Sail.** `Dockerfile` (multi-stage) + `docker-compose.yml` (app/nginx/queue/scheduler/
  mysql). Vendor Sail в репозитории отсутствует.
- **Синк сертификатов из Bitrix** — основа статуса выпускника (`is_graduate`).

## TODO
- Зафиксировать решение по CI/CD, когда оно будет принято.
