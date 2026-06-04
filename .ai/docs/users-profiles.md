# Module: Users & Profiles

## Назначение
Профили пользователей, роли, портфолио, рейтинги/отзывы, избранное, отклики.

## Ключевые файлы
- Контроллеры: `UserController`, `ProfileController`, `PortfolioController`, `ReviewController`,
  `FavoriteController`, `FeedbackController`.
- Сервисы/репозитории: `UserService`/`UserRepository`, `ReviewService`/`ReviewRepository`,
  `FavoriteService`/`FavoriteRepository`.
- Модели: `User` (role_id, profession_id, phone uniq, is_graduate, is_blocked, gender),
  `Portfolio`, `Review`, `Favorite`, `Response`, `Organization`.
- Enum: `Roles`.
- Реквесты: `ProfileUpdateRequest`, `UserProfileRequest`, `UserStoreRequest`, `UserUpdateRequest`,
  `StoreUserRequest`.
- Маршруты (`auth`): `/profile`, `/update`, `/edit`, `/my-responses`, `/fav/{id}`,
  `/rate/{employee_id}/{rating}`, `portfolio/*`, `POST /send-feedback`.
- Страницы: `Pages/Profile.jsx`, `Pages/User.jsx`, `Pages/UpdateUser.jsx`, `Pages/UserResponses.jsx`,
  `Pages/Employees.jsx`, `Pages/Favs.jsx`.
- Админ: `Admin\UserController` (`admin/users/*`, search, info), Blade `resources/views/admin/users/*`.

## Поведение
- Рейтинг работодателя — `UserController@rate`.
- Избранное — toggle через `FavoriteController`.
- Обратная связь — `FeedbackController@sendFeedback` (axios).
