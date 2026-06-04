# Module: Resumes

## Назначение
Создание/редактирование резюме соискателя, привязка специализаций, отклики на вакансии.

## Ключевые файлы
- Контроллеры: `ResumeController`, `UserResumeController`, `UserCVController`,
  `ResumeSpecializationController`.
- Модели: `Resume` (user_id, city, area), `UserResume`, `UserCV`, `ResumeSpecialization`,
  `Specialization`, `SpecializationCategory` (последние две — мультиязычные).
- Маршруты (`auth`): `resumes/send`, `resumes/*` (CRUD), специализации.
- Страницы: `Pages/Resume.jsx`, `Pages/CreateResume.jsx`, `Pages/UpdateResume.jsx`.
- PDF: возможна генерация через barryvdh/laravel-dompdf (`resources/views/pdf/`).

## Поток
Соискатель создаёт резюме → выбирает специализации → откликается на вакансию (`Response`).

## TODO / уточнить
- Различие `Resume` vs `UserResume` vs `UserCV` — уточнить по моделям/использованию перед правками.
