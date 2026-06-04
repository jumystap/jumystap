# Module: Announcements (вакансии)

## Назначение
Размещение вакансий работодателями, модерация (через Telegram), отображение и архивация.

## Ключевые файлы
- Контроллер: `AnnouncementController` (`routes/web.php`: список, просмотр, CRUD под `auth`).
- Сервис/репозиторий: `AnnouncementService`, `AnnouncementRepository`.
- Модель: `Announcement` + дети `AnnouncementAdress`, `AnnouncementCondition`,
  `AnnouncementRequirement`, `AnnouncementResponsibility`; аудит `AnnouncementHistory`.
- Enum: `AnnouncementStatus` — ON_MODERATION(0), ACTIVE(1), BLOCKED(2), ARCHIVED(3).
  Observer: `AnnouncementObserver`. Rule: `CheckAnnouncementAuthor`.
- Реквесты: `AnnouncementCreateRequest`, `AnnouncementUpdateRequest`, `AnnouncementArchiveRequest`,
  `AnnouncementRepublishRequest`.
- Модерация: `app/Telegram/Handler.php` (accept → ACTIVE+published_at; reject → BLOCKED).
- Команда: `ArchiveOldAnnouncementsCommand` (`app:announcements:archive-old`, >6 мес.).
- Админ: `routes/admin.php` resource announcements; Blade `resources/views/admin/announcements/*`.
- Страницы: `Pages/Announcement.jsx`, `Pages/Announcements.jsx`, `Pages/Company/CreateAnnouncement.jsx`,
  `Pages/Company/UpdateAnnouncement.jsx`, `Pages/Company/CompanyAnnouncement.jsx`.
- Переводимые поля: `type_kz`/`type_ru` (мультиязычность по колонкам).

## Поток
Создание → модерация (Telegram-уведомление админам) → accept/reject → ACTIVE/BLOCKED →
история изменений → архивация по сроку.

## Тесты
`tests/Unit/Services/AnnouncementServiceTest.php`,
`tests/Unit/Repositories/AnnouncementRepositoryTest.php`,
`tests/Unit/Controllers/AnnouncementControllerTest.php`.

## TODO / уточнить
- Точные условия/триггеры переходов между статусами (кто и когда ставит ARCHIVED помимо команды).
