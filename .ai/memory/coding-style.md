# Memory: Coding style

- **PHP:** Laravel Pint (preset Laravel). Запускать `./vendor/bin/pint` перед коммитом.
- **Именование:** модели — единственное число; `XController`, `XService`, `XRepository`, `XRequest`,
  enum по сущности (`AdStatus`). Реквесты встречаются в двух стилях: `StoreXRequest`/`UpdateXRequest`
  и `XCreateRequest`/`XUpdateRequest` — ориентируйся на соседние файлы домена.
- **Слои:** контроллер → сервис → репозиторий → модель. Никакого SQL в контроллерах.
- **Enums:** с методами-хелперами (`label/color/badgeClass/isPublished/canEdit`, `options`).
- **Мультиязычность:** трейт `Multilingual`, колонки `*_kz/*_ru/*_en`, чтение через `$model->name`.
- **Frontend:** функциональные React-компоненты, импорты через `@/`, формы react-hook-form,
  состояние через Inertia-props/useState, UI — antd/tailwind/headless/lucide. Строки во все локали.
- **Комментарии:** минимум, поясняют «почему». Не оставлять закомментированный код в новых правках.
- **Тесты:** Pest; Feature для HTTP/Inertia (RefreshDatabase), Unit для классов.

## Наблюдения (как есть в проекте)
- В существующем коде встречаются опечатки в именах (`AnnouncementAdress`, `ProfessionEquimpments`).
  Это уже закреплённые имена классов/таблиц — НЕ переименовывать (сломает ссылки/миграции), но и
  не копировать опечатки в новые сущности.
