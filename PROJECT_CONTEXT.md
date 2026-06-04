# PROJECT_CONTEXT — JUMYSTAP

Бизнес-контекст проекта для AI-агентов и новых разработчиков. Описывает **что** делает система
и **почему**, без деталей реализации (они — в `ARCHITECTURE.md`).

---

## 1. Цель проекта

JUMYSTAP — казахстанская онлайн-платформа, соединяющая:

- **соискателей** (выпускники курсов, рабочие специальности) с **работодателями**;
- продавцов **товаров и услуг** с покупателями (раздел объявлений-маркетплейса);
- образовательную экосистему: подтверждение квалификации через **сертификаты** (синк из Bitrix).

Платформа двуязычна в интерфейсе (русский, казахский) и трёхъязычна по модели данных
(`*_ru` / `*_kz` / `*_en`).

---

## 2. Предметная область

Рынок труда и услуг Казахстана с акцентом на рабочие и сервисные профессии (бариста, швея,
сварщик, кассир, мебельщик, обувщик, моделье и др. — см. сидеры профессий). Профессии
сгруппированы в группы (`group_professions`), имеют навыки, оборудование и преподавателей.

Пользователи-выпускники получают флаг `is_graduate`, когда из Bitrix приходит подтверждённый
сертификат по освоенной профессии.

---

## 3. Роли пользователей

Роли заданы enum `App\Enums\Roles` (поле `users.role_id`):

| ID | Роль | Назначение |
|----|------|-----------|
| 1 | employer | Работодатель (физлицо), публикует вакансии |
| 2 | employee | Соискатель, создаёт резюме, откликается |
| 3 | company | Компания/организация |
| 4 | admin | Полный доступ к админ-панели |
| 5 | moderator | Модерация (доступ в админку наравне с admin через `AdminMiddleware`) |
| 6 | non_graduate | Соискатель без подтверждённой квалификации |

> Подтверждай актуальные значения по `app/Enums/Roles.php` перед использованием в коде.

Доступ в админ-зону (`/admin/*`) гейтится `AdminMiddleware` — разрешён только `admin` и `moderator`.
Заблокированные пользователи (`is_blocked`) принудительно разлогиниваются (`BlockedUserLogout`).

---

## 4. Основные сущности

| Сущность | Модель | Описание |
|----------|--------|----------|
| Пользователь | `User` | role_id, profession_id, phone (uniq), is_graduate, is_blocked, gender |
| Вакансия | `Announcement` | объявление о работе; дети: `AnnouncementAdress`, `AnnouncementCondition`, `AnnouncementRequirement`, `AnnouncementResponsibility`; аудит: `AnnouncementHistory` |
| Объявление-маркетплейс | `Ad` | товар/услуга; дети: `AdPhoto`, `AdContact`, `AdCategory`, `AdStatusHistory`, `AdView`; enum `AdStatus`/`AdType`/`PriceType` |
| Резюме | `Resume`, `UserResume`, `UserCV`, `ResumeSpecialization` | резюме соискателя и связи со специализациями |
| Профессия | `Profession\*` | профессии, группы, навыки, оборудование, преподаватели |
| Специализация | `Specialization`, `SpecializationCategory` | мультиязычные справочники |
| Отклик | `Response` | связка employer_id ↔ employee_id |
| Отзыв | `Review` | имя, телефон, текст отзыва |
| Сертификат | `Certificate`, `UserProfession` | подтверждение квалификации (синк Bitrix) |
| Избранное | `Favorite` | закладки пользователя |
| Посещение | `Visit` | аналитика трафика |
| Клик-аналитика | `AnalyticByClick`, `AnalyticParameter` | трекинг кликов по параметрам |
| Telegram-админ | `TelegramAdmin` | chat_id админов для уведомлений модерации |
| Город / Индустрия / Бизнес-тип | `City`, `Industry`, `BusinessType`, `Organization` | справочники |

> Полные поля и связи — `.ai/context/database.md` и `.ai/docs/*`.

---

## 5. Основные процессы

### 5.1 Публикация и модерация вакансии
1. Работодатель создаёт `Announcement` (статус — см. `AnnouncementStatus`).
2. Объявление уходит на модерацию; админы получают уведомление в Telegram.
3. Модератор в Telegram нажимает **accept** → статус `ACTIVE`, `published_at = now()`;
   либо **reject** → статус `BLOCKED`. Логика — `app/Telegram/Handler.php`.
4. `AnnouncementObserver` и `AnnouncementHistory` фиксируют изменения.
5. Команда `app:announcements:archive-old` архивирует объявления старше 6 месяцев.

### 5.2 Объявления-маркетплейс (Ads)
1. Пользователь создаёт `Ad` (товар/услуга) с фото, контактами, ценой (`PriceType`).
2. Статусы по `AdStatus` (draft → moderation → active/inactive/rejected), история в `AdStatusHistory`.
3. Просмотры и показы контактов считаются (`views_count`, `contacts_shown_count`, `AdView`).
4. Админ одобряет/отклоняет в админ-панели (Ads resource).

### 5.3 Резюме и отклики
1. Соискатель создаёт резюме, указывает специализации.
2. Откликается на вакансию → создаётся `Response`.
3. Работодатель видит отклики (`/my-responses`, админ — `Admin\ResponseController`).

### 5.4 Сертификация (синк Bitrix)
1. Ежедневные команды `app:get-certificates {work|digital}` тянут сертификаты из Bitrix API.
2. Маппинг ~28 профессий на внутренние ID, обновление `UserProfession`, `is_graduate = 1`.
3. `app:delete-certificates` снимает устаревшие; если профессий не осталось — `is_graduate = 0`.

### 5.5 Определение пола
`app:fix-gender` обрабатывает по 200 необработанных пользователей-employee за запуск,
вызывая внешний gender-API, сохраняет `gender` (ж/м) и вероятность.

### 5.6 Аналитика посещений
Каждый web-запрос проходит `TrackVisits` middleware → запись `Visit` (user_id|null, url, ip,
device_type через jenssegers/agent). `TrackVisitJob` существует, но в middleware сейчас
используется синхронная запись (см. `.ai/memory/known-limitations.md`).

---

## 6. Связи между модулями

```
User ──< Announcement ──< (Adress/Condition/Requirement/Responsibility)
  │           └──< AnnouncementHistory
  │
  ├──< Ad ──< (AdPhoto / AdContact / AdStatusHistory / AdView)
  │     └── AdCategory, City, BusinessType
  │
  ├──< Resume ──< ResumeSpecialization >── Specialization
  ├──< Response >── (employer ↔ employee)
  ├──< Favorite
  ├──< UserProfession >── Profession (Bitrix-сертификаты)
  └──< Visit (аналитика)

Profession >── GroupProfession, ProfessionSkills, ProfessionTeachers, ProfessionEquimpments
TelegramAdmin ── уведомления модерации Announcement
```

---

## 7. Внешние интеграции

| Интеграция | Назначение | Конфиг |
|-----------|-----------|--------|
| Telegram (telegraph) | Модерация объявлений, уведомления | `config/telegraph.php`, `POST /telegram/webhook` |
| Bitrix CRM | Синк сертификатов выпускников | `config/services.php` → `bitrix`, `BITRIX_URI` |
| SMSC | Отправка SMS (коды верификации) | `config/services.php` → `smsc`, `SMSC_*` |
| Gender API | Определение пола по имени | `config/services.php` → `gender`, `GENDER_API_*` |

---

## 8. Что НЕ входит в систему (на момент аудита)

- Нет онлайн-оплаты/платёжного модуля (поля `payment_type`/`cost` у объявлений — это условия
  работы/цена, не транзакции платформы).
- Нет встроенного чата как полноценного модуля (`/chat` → `HomeController@chat`, страница-заглушка).
- Нет событий/листенеров Laravel, нет Mailables/Notifications в стандартном виде
  (уведомления — кастомный `App\Services\Notification\NotificationService` с каналами SMS/Email/SMSC).

> Если появляется задача в этих областях — это новая разработка, а не доработка существующего модуля.
