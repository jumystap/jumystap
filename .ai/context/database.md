# Context: Database

## Подключение
- Реальное: **MySQL 8** (`DB_CONNECTION=mysql` в `.env.example`).
- ⚠️ `config/database.php` имеет `default => 'sqlite'` — это лишь дефолт; подключение определяется
  `DB_CONNECTION`. Не полагайся на дефолт.
- Очередь/кэш/сессии — драйвер `database` (таблицы `jobs`, `job_batches`, `failed_jobs`, `cache`,
  `sessions`).

## Миграции
- ~106 миграций в `database/migrations/`. Многие — `ALTER` поверх базовых таблиц (норма проекта).
- Правило: только новые миграции, старые не редактировать.

## Ключевые таблицы (поля — ориентир, сверяй с миграциями)
- **users**: id, name, role_id (FK), profession_id (FK, nullable), phone (unique), email,
  phone_verified_at, password, is_graduate, is_blocked, gender, timestamps. SoftDeletes.
- **announcements**: user_id (FK), type_kz/type_ru, title, description, payment_type, cost, active,
  + ALTER: industry_id, city_id, salary, status, is_permanent, published_at. SoftDeletes.
- **ads**: user_id (FK), type, title, description, category_id, subcategory_id, city_id (FK),
  address, price_from/price_to/price_exact, price_type, phone, use_profile_phone,
  company_description, business_type_id (FK), status, published_at, expires_at, views_count,
  contacts_shown_count. SoftDeletes.
- **resumes**: user_id (FK), city, area. **responses**: employer_id, employee_id.
- **reviews**: name, phone, review.
- Дети: announcement_adresses/conditions/requirements/responsibilities, announcement_histories,
  ad_photos, ad_contacts, ad_status_histories, ad_views, ad_favorites, ad_categories.
- Справочники: roles, cities, industries, business_types, organizations, specializations,
  specialization_categories, group_professions, professions, professions_skills, user_professions,
  certificates, codes, analytic_parameters, analytic_by_clicks, telegraph_bots, telegraph_chats.

## Сидеры (27)
DatabaseSeeder, RolesSeeder, CitySeeder, IndustrySeeder, ProfessionSeeder/ProfessionGroupSeeder,
SpecializationSeeder/SpecializationCategorySeeder, AdCategorySeeder, AnalyticParameterSeeder,
UsersSeeder/AdminUserSeeder/ModeratorUserSeeder/EmployeeSeeder/CompaniesSeeder,
AnnouncementsSeeder, ReviewSeeder, TeacherSkillsSeeder + профессиональные демо-сидеры
(Barista, Modelier, Svarshik, Shveya, Kassir, Mebel, Digita, Shoes).

## Фабрики
- Только `UserFactory`. Для тестов новых сущностей создавай фабрику по необходимости.

## Конвенции
- Переводимые поля — `*_kz/*_ru/*_en` (трейт `Multilingual`).
- SoftDeletes у `Ad`/`Announcement`/`User`.
- FK на справочники (city_id, industry_id, business_type_id, role_id, profession_id).

## Правила изменения
- Схема — только миграциями (новыми). Справочные данные — сидерами. Индексы для оптимизации —
  отдельной миграцией. Проверка: `php artisan migrate:fresh --seed`.
