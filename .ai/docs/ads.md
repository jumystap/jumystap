# Module: Ads (объявления-маркетплейс)

## Назначение
Размещение товаров/услуг с фото, контактами, ценой; модерация в админке; учёт просмотров и
показов контактов.

## Ключевые файлы
- Контроллер: `AdController` (`routes/web.php`: `/ads`, `/ads2`, `/ad/{id}`, `/ad/connect/{ad_id}`).
- Сервис/репозиторий: `AdService`, `AdRepository` (фильтры: keyword, type, category, city, price).
- Модель: `Ad` + дети `AdPhoto`, `AdContact`, `AdCategory`, `AdStatusHistory`, `AdView`. SoftDeletes.
- Enums: `AdStatus` (draft/moderation/active/inactive/rejected + методы), `AdType`, `PriceType`.
- Реквесты: `StoreAdRequest`, `UpdateAdRequest`.
- Админ: `routes/admin.php` ads resource (approve/reject/bulkAction, удаление фото);
  Blade `resources/views/admin/ads/*`.
- Страницы: `Pages/Ad.jsx`, `Pages/AdProduct.jsx`, `Pages/AdService.jsx`, `Pages/Ads.jsx`,
  `Pages/AdsProduct.jsx`, `Pages/AdsService.jsx`.
- Изображения: intervention/image + spatie/laravel-image-optimizer.
- Мультиязычные категории: `AdCategory` использует трейт `Multilingual`.

## Поток
Создание (draft) → отправка на модерацию → admin approve/reject → active/inactive →
учёт `views_count`/`contacts_shown_count`/`AdView`; история — `AdStatusHistory`.

## TODO / уточнить
- Точные переходы `AdStatus` и условия `canEdit()` — сверить с enum.
