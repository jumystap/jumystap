# Module: Professions & Certificates (Bitrix)

## Назначение
Справочник профессий (группы, навыки, оборудование, преподаватели) и подтверждение квалификации
выпускников через синхронизацию сертификатов из Bitrix.

## Ключевые файлы
- Профессии: `app/Models/Profession/*` (Profession, GroupProfession, ProfessionSkills,
  ProfessionTeachers, ProfessionImages, ProfessionEquimpments, EquipmentDetails, EquipmentImages,
  TeacherSkills). `Profession` — мультиязычная (`Multilingual`).
- Контроллер: `ProfessionController` (`/profession/{group}`), страница `Pages/Profession.jsx`.
- Сертификаты: `Certificate`, `UserProfession`, `CertificateService`/`CertificateRepository`,
  `CertificateController` (web + `GET /api/certificates/{id}`), `CertificateStoreRequest`.
- Команды синка (Bitrix): `GetCertificatesCommand` (`app:get-certificates {work|digital}`),
  `UpdateCertificatesCommand`, `DeleteCertificatesCommand`. Конфиг — `config/services.php` → bitrix.
- Расписание: `app/Console/Kernel.php` (get 00:01/01:01, delete 02:01/03:01 daily).
- Админ: `Admin\CertificateController`, Blade `resources/views/admin/certificates/*`,
  `Pages/Admin/AdminCertificates.jsx`.

## Поток
Bitrix → команда синка → маппинг ~28 профессий → `UserProfession` → `users.is_graduate`.

## TODO / уточнить
- Таблица маппинга профессий Bitrix→внутренние ID — в коде команд; при изменениях профессий
  обновлять и маппинг.
