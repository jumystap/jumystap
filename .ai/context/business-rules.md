# Context: Business rules

Бизнес-правила JUMYSTAP, выведенные из кода. Подтверждай детали по `app/` перед реализацией.

## Роли и доступ
- Роли — enum `App\Enums\Roles`: employer(1), employee(2), company(3), admin(4), moderator(5),
  non_graduate(6). Поле `users.role_id`.
- Админ-зона `/admin/*` — только admin и moderator (`AdminMiddleware`).
- Заблокированный пользователь (`users.is_blocked`) принудительно разлогинивается (`BlockedUserLogout`).

## Вакансии (Announcement)
- Создаются работодателем; статусы — enum `AnnouncementStatus`.
- Модерация через Telegram: callback `accept` → `ACTIVE` + `published_at = now()`; `reject` → `BLOCKED`
  (`app/Telegram/Handler.php`).
- Изменения отслеживает `AnnouncementObserver`; история — `AnnouncementHistory`.
- Авторство проверяется правилом `CheckAnnouncementAuthor`.
- Объявления старше 6 месяцев архивируются командой `app:announcements:archive-old`.
- Дочерние данные: адрес, условия, требования, обязанности (`AnnouncementAdress/Condition/
  Requirement/Responsibility`).

## Объявления-маркетплейс (Ad)
- Статусы — enum `AdStatus` (draft → moderation → active/inactive/rejected) с методами
  `label/color/badgeClass/isPublished/canEdit`. Тип — `AdType`. Цена — `PriceType`
  (price_from/price_to/price_exact).
- История статусов — `AdStatusHistory`. Просмотры/показы контактов — `views_count`,
  `contacts_shown_count`, `AdView`.
- Модерация одобрение/отклонение — в админ-панели (Ads resource: approve/reject/bulkAction).

## Резюме и отклики
- Соискатель создаёт резюме (`Resume`/`UserResume`/`UserCV`) со специализациями.
- Отклик на вакансию — `Response` (employer_id ↔ employee_id).

## Сертификация (Bitrix)
- `app:get-certificates {work|digital}` тянет сертификаты, маппит ~28 профессий, обновляет
  `UserProfession`, ставит `users.is_graduate = 1`.
- `app:delete-certificates` снимает устаревшие; без профессий — `is_graduate = 0`.
- `app:update-certificates` — полный пересинк.

## Определение пола
- `app:fix-gender` обрабатывает по 200 пользователей-employee за запуск через внешний API,
  пишет `gender` (ж/м) и вероятность.

## Аналитика
- Каждый web-запрос → `Visit` (через `TrackVisits`). Клики — `AnalyticByClick`/`AnalyticParameter`
  (`POST analytics/click`).

## Мультиязычность контента
- Переводимые поля — `*_kz/*_ru/*_en`, чтение через трейт `Multilingual` (`$model->name`),
  нормализация `kk→kz`. Модели с трейтом: `Profession`, `Specialization`, `AdCategory`,
  `SpecializationCategory` (проверяй актуальный список).

## Чего нет (не выдумывать)
- Нет онлайн-оплаты, нет полноценного чата, нет Laravel events/listeners, нет Mailables/Notifications
  (уведомления — `App\Services\Notification\NotificationService` с каналами SMS/Email/SMSC).
