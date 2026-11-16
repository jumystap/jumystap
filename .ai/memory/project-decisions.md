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
- **Выгрузка опроса трудоустройства — XLSX.** Админский маршрут
  `admin.placement-surveys.export` использует PhpSpreadsheet через `PlacementSurveyService` и
  существующий `AdminMiddleware`. Свободный текст пишется ячейками типа `TYPE_STRING`, чтобы Excel
  не исполнял пользовательские значения как формулы.
- **Все объявления — вакансии; тип «Заказ» не используется.** Публичная часть сайта поле типа не
  читает и показывает всё как вакансии, а форма создания исторически сохраняла `type_ru = 'Заказ'`.
  Теперь по умолчанию `type_ru`/`type_kz` = `'Вакансия'` (`Company/CreateAnnouncement.jsx`;
  `Company/UpdateAnnouncement.jsx` сохраняет текущий тип, фолбэк — «Вакансия»). Существующие строки
  переведены миграцией `2026_10_27_000000_convert_announcement_type_order_to_vacancy` через
  `DB::table()` (не Eloquent — чтобы не сдвинуть `updated_at`, от которого зависят `recentActive()`,
  автоархивация и сортировка). `down()` намеренно пустой: откат неотличим от порчи настоящих вакансий.
  Фильтр по типу удалён в избранном (`Favs.jsx`) и в админке (список объявлений, ветка `type`
  в `Announcement::search`). Админка тип не выставляет — только фильтровала по нему.

- **Лимит откликов — 30 за скользящие 24 часа на аккаунт.** `AnnouncementService::respondToAnnouncement`:
  в одной транзакции блокирует строку пользователя (`UserRepository::lockUserForUpdate`), чтобы
  параллельные запросы не превысили лимит, затем считает отклики через `AnnouncementRepository`.
  Повторный переход по вакансии, на которую уже был отклик за последние 24 часа, лишь снова
  открывает WhatsApp: новый отклик не пишется, лимит не проверяется и не расходуется (номер уже
  показан — парсеру это ничего не даёт). Через 24 часа переход по той же вакансии — новый отклик.
  Окно скользящее, а не календарное: в 23:59 и 00:01 нельзя сделать 60 подряд.
  При превышении — 429 без записи и перехода, с `Retry-After` и временем (`H:i`, `Asia/Almaty`),
  когда самому старому отклику в окне исполнится 24 часа; текст `responses.daily_limit` в ru/kk/en.
  Маршрут — `POST /connect/{announcement_id}` (CSRF) с `whereNumber`: кривой id даёт 404, GET — 405.
  GET-ссылкой чужой сайт откликался бы от имени пользователя и тратил его лимит. Фронт шлёт
  `router.post` (`resources/js/utils/announcementConnect.js`); ответ — `Inertia::location` на wa.me,
  при лимите для Inertia — `back()->withErrors(['connect' => ...])` и уведомление, без Inertia — 429.
  `?connect=true` после логина откликается сам, только если в этой вкладке есть отметка клика гостя
  в `sessionStorage` (`pendingConnect`), иначе любая ссылка с `?connect=true` откликалась бы за
  пользователя; параметр убирается и из URL, и из `history.state.url`, чтобы «Назад» не повторял.
  Соискатель берётся только из сессии. Старый `GET /connect/{employee_id}/{announcement_id}` ведёт
  на страницу вакансии (сам переход отклик не создаёт) — для открытых вкладок и ссылок.
  Отклик разрешён только на активную неудалённую вакансию, иначе 404 без расхода квоты; на
  неактивной (её видит лишь админ) `show` передаёт `canRespond = false`, кнопка скрыта.
  Последнее активное резюме — `ResumeRepository::findLatestActiveForUser` (порядок `created_at`,
  `id`, как у работодателя в `UserController::latestActiveResumeIds`).
  При мягком удалении вакансии отклики сохраняются: удаление не должно освобождать квоту.
  Исторические строки без `announcement_id` не учитываются. Индекс `(employee_id, created_at)` —
  миграция `2026_11_16_000000_add_daily_response_limit_index_to_responses_table`.
  `phone` вакансии скрыт на уровне модели (`Announcement::$hidden`): без этого номер читался из
  Inertia-props ленты `/` (гостям, постранично), страницы вакансии и `/fav` в обход лимита.
  Единственный потребитель — форма редактирования (`edit` → `Company/UpdateAnnouncement`), там
  `makeVisible('phone')`; без него работодатель молча стёр бы номер при сохранении. На «Моих
  откликах» связь работодателя грузится как `user:id,name` (у `User` скрыт только пароль/токен).
  Серверный код (`$announcement->phone`, админ-Blade, Telegram) `$hidden` не затрагивает.
  Объявления (`Ad`): `phone` объявления — публичный контакт продавца (иконка WhatsApp), не скрывается;
  скрыт автор: список грузит `user:id,name,image_url,is_graduate`, `AdController::show` делает
  `setVisible` (полную модель `getAdById` грузит ради `connect`, которому нужен номер профиля).
  У `/ad/connect` (GET) лимита нет.
- **Язык обычных переходов (не axios) — cookie `locale`.** `AppServiceProvider::boot` читает её до
  `EncryptCookies`, поэтому открытое значение из JS работает (проверено на dev: `locale=kk`/`kz` →
  казахская валидация). Проблема была в сроке: cookie без `max-age` пропадала при закрытии браузера,
  и сервер отвечал по-русски при казахском интерфейсе из `localStorage`. Теперь `bootstrap.js`
  синхронизирует её с `localStorage` на каждом запуске, переключатели пишут `max-age` на год.

## TODO

- Зафиксировать решение по CI/CD, когда оно будет принято.
