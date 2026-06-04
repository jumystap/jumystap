# Context: Frontend rules

## Стек
React 18 (JSX) + Inertia.js, Vite 6, Tailwind 3, Ant Design 5, Headless UI, lucide-react/react-icons,
framer-motion, react-slick. Формы — react-hook-form. Прямые запросы — axios.

## Структура
- Страницы: `resources/js/Pages/{Area}/Name.jsx` (публичные, `Admin/`, `Company/`).
- Компоненты: `resources/js/Components/` (+ `Mobile/`, `Welcome/`).
- Layouts: `GuestLayout` (публичные), `AdminLayout` (админка).
- Entry: `resources/js/app.jsx` (createInertiaApp + I18nextProvider). Алиас `@/` → `resources/js/`.

## Состояние и данные
- Серверное состояние — Inertia-props; локальное — `useState`. **Нет Redux/Zustand/глобального Context-стора** — не вводить.
- Навигация и мутации — Inertia `router`. Прямые вызовы (feedback, portfolio, logout) — `axios`.

## Формы
- `react-hook-form`. Маски/телефон/валюта — react-input-mask, react-phone-input-2,
  react-currency-input-field. HTML-контент пользователя — санитизировать `dompurify`.

## UI
- Не добавлять новые UI-библиотеки. Сопоставлять с соседними компонентами (antd vs headless vs
  кастомный Tailwind). Иконки — lucide-react/react-icons. Карусели — react-slick.

## Локализация (react-i18next)
- Строки — JSON в `public/locales/ru/` и `public/locales/kz/` (обе локали обязательно).
- Namespace должен быть в массиве `ns` (`resources/js/i18n.js`): header, index, employees,
  profession, announcements, login, carousel, register, faq, updateNonEmployee, createAnnouncement.
- Новый namespace — добавить и файл, и регистрацию в `ns`.

## Blade-нюанс
- Часть админки — Blade (`resources/views/admin/*`: account, ads, analytics, announcements,
  certificates, users, layouts, partials). Перед правкой админ-экрана определи: Blade или React.
- Корневой shell — `resources/views/app.blade.php` (содержит GTM и Яндекс-метрику).

## Сборка
- `npm run dev` (HMR), `npm run build` (ассеты в `public/build`, хешированные имена).
- Tailwind purge: `./resources/views`, `./resources/js`. Шрифт — Figtree (`tailwind.config.js`).
