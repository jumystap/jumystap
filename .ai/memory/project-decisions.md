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
- **Заявки из FeedbackModal сохраняются до Telegram.** Таблица `feedback_applications` — источник
  истины для заявок с сайта; Telegram-уведомление отправляется после записи и не откатывает её при
  сбое интеграции. Жалобы из `ScamModal` остаются на отдельном существующем Telegram-потоке.
- **Возврат из карточки соискателя к поиску.** `/employees` сохраняет полный URL поиска в
  `sessionStorage` (`lastSearch:employees`), публичный профиль возвращает на этот URL через
  `BackToSearch`, а страница резюме возвращает гостя/работодателя в публичный профиль владельца
  `/user/{id}` и самого владельца — в личный `/profile`. Это сохраняет фильтры и страницу поиска,
  но не точную вертикальную позицию прокрутки.

- **Причина архивации вакансии сохраняется.** Модалка архивации спрашивает «Вы нашли сотрудника
  через наш сайт?» с 4 вариантами. Фронт (`Company/CompanyAnnouncement.jsx`, `Company/Dashboard.jsx`)
  шлёт единый `reason` на `POST /announcements/archive`; значения — числовой enum
  `AnnouncementArchiveReason: int` (1 found_on_site / 2 found_other_platform / 3 no_longer_relevant)
  плюс строковый sentinel `republish`. Колонка `archive_reason` — `unsignedTinyInteger` nullable
  (radio на фронте отдаёт числа, контроллер делает `from((int) $reason)`). При
  архивации пишутся `announcements.archive_reason` + `archived_at`. `republish` уводит вакансию в
  `ON_MODERATION` без записи причины. Старая колонка `is_employee_found` удалена: при миграции
  архивным строкам с `is_employee_found = true` проставлен `found_on_site`, остальные (старый «false»
  не различал «другая площадка»/«неактуально») остались с `null`-причиной («—» в админке).
  Админ-раздел «Архив вакансий»
  (`admin.announcements.archive` → `resources/views/admin/announcements/archive.blade.php`) фильтрует
  `status = ARCHIVED` и выводит Работодатель · Вакансия · Кол-во откликов · Дата архивации · Ответ.

## TODO
- Зафиксировать решение по CI/CD, когда оно будет принято.
