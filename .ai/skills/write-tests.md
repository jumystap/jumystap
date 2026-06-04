# Skill: write-tests

Написание тестов Pest для JUMYSTAP.

## Когда использовать
Любая новая фича или багфикс; повышение покрытия критичной логики.

## Последовательность
1. **Определи тип:**
   - Поведение через HTTP/Inertia → `tests/Feature/` (`Auth/` или `Controllers/`), с `RefreshDatabase`.
   - Изолированный класс (Service/Repository/Controller-метод) → `tests/Unit/`.
2. **Образцы:** `tests/Unit/Services/AnnouncementServiceTest.php`,
   `tests/Unit/Repositories/UserRepositoryTest.php`, `tests/Feature/Auth/*`,
   `tests/Unit/Controllers/UserControllerTest.php`.
3. **Данные:** `UserFactory` есть; для других сущностей создай фабрику или подготовь данные сидером.
4. **Окружение:** тесты используют `phpunit.xml` (testing DB, array cache/session, sync queue,
   bcrypt rounds 4). Внешние API (Bitrix/SMSC/Gender) — мокать.
5. Покрой happy-path, ошибки валидации, авторизацию (гость/employee/admin).

## Обязательные проверки
- `./vendor/bin/pest --filter=NewTest`
- `./vendor/bin/pest` (полный прогон зелёный)

## Expected output
Детерминированные тесты в правильном каталоге, покрывающие новую логику и граничные случаи;
внешние сервисы замоканы; полный прогон зелёный.
