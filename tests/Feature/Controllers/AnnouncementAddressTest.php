<?php

use App\Enums\Roles;
use App\Models\Announcement;
use App\Models\AnnouncementAdress;

/**
 * Полезная нагрузка формы вакансии. Адрес вынесен в параметр — именно
 * вокруг него вся логика координат.
 */
function announcementPayload(array $locations, array $overrides = []): array
{
    return array_merge([
        'type_kz' => 'Тапсырыс',
        'type_ru' => 'Заказ',
        'title' => 'Кассир',
        'description' => 'описание',
        'payment_type' => 'Ежемесячная оплата',
        'status' => 1,
        'salary_type' => 'min',
        'specialization_id' => 1, // колонка без значения по умолчанию
        'cost_min' => 150000,
        'city' => 'Алматы',
        'location' => $locations,
        'responsibility' => ['обслуживать кассу'],
        'requirement' => ['опыт работы'],
        'condition' => ['оформление по ТК'],
    ], $overrides);
}

function point(array $overrides = []): array
{
    return array_merge([
        'adress' => 'улица Абая, 150',
        'latitude' => 43.237583,
        'longitude' => 76.883742,
        'without_point' => false,
    ], $overrides);
}

function postAnnouncement(array $payload)
{
    return test()->actingAs(makeUser(Roles::EMPLOYER->value))
        ->post('/announcements/store', $payload);
}

it('сохраняет адрес вместе с координатами', function () {
    postAnnouncement(announcementPayload([point()]))->assertSessionHasNoErrors();

    $address = AnnouncementAdress::query()->latest('id')->first();

    expect($address->adress)->toBe('улица Абая, 150')
        // decimal в Eloquent по умолчанию приходит строкой — каст обязан отдать float,
        // иначе ymaps получит ["43.2", "76.8"] вместо чисел и метку не поставит
        ->and($address->latitude)->toBeFloat()->toBe(43.237583)
        ->and($address->longitude)->toBeFloat()->toBe(76.883742);
});

it('не даёт сохранить адрес без координат', function () {
    // Главный сценарий: работодатель ввёл адрес руками и не нажал «Найти».
    postAnnouncement(announcementPayload([point(['latitude' => null, 'longitude' => null])]))
        ->assertSessionHasErrors('location.0.latitude');

    expect(Announcement::query()->where('title', 'Кассир')->exists())->toBeFalse();
});

it('не даёт сохранить адрес с одной только широтой', function () {
    postAnnouncement(announcementPayload([point(['longitude' => null])]))
        ->assertSessionHasErrors('location.0.longitude');
});

it('пропускает охватный адрес без координат, если он помечен without_point', function () {
    // «более 30 филиалов» — точки не существует, карта для такого скрыта.
    postAnnouncement(announcementPayload([
        point(['adress' => 'более 30 филиалов', 'latitude' => null, 'longitude' => null, 'without_point' => true]),
    ]))->assertSessionHasNoErrors();

    $address = AnnouncementAdress::query()->latest('id')->first();

    expect($address->adress)->toBe('более 30 филиалов')
        ->and($address->latitude)->toBeNull();
});

it('не требует адрес для дистанционного города', function () {
    postAnnouncement(announcementPayload([], ['city' => 'Дистанционное']))
        ->assertSessionHasNoErrors();

    $announcement = Announcement::query()->where('title', 'Кассир')->first();

    expect($announcement)->not->toBeNull()
        ->and(AnnouncementAdress::where('announcement_id', $announcement->id)->count())->toBe(0);
});

it('не требует адрес при удалённом графике', function () {
    postAnnouncement(announcementPayload([], ['work_time' => 'Удаленная работа']))
        ->assertSessionHasNoErrors();
});

it('требует адрес для обычного города', function () {
    postAnnouncement(announcementPayload([], ['city' => 'Алматы']))
        ->assertSessionHasErrors('location');
});

it('отклоняет координаты вне допустимого диапазона', function () {
    postAnnouncement(announcementPayload([point(['latitude' => 999])]))
        ->assertSessionHasErrors('location.0.latitude');

    postAnnouncement(announcementPayload([point(['longitude' => -181])]))
        ->assertSessionHasErrors('location.0.longitude');
});

it('отклоняет адрес, присланный строкой: в старом формате координат нет', function () {
    postAnnouncement(announcementPayload(['улица Абая, 150']))
        ->assertSessionHasErrors('location.0.latitude');
});

it('сохраняет несколько адресов, каждый со своей точкой', function () {
    postAnnouncement(announcementPayload([
        point(['adress' => 'улица Абая, 150']),
        point(['adress' => 'улица Сейфуллина, 100', 'latitude' => 43.25, 'longitude' => 76.94]),
    ]))->assertSessionHasNoErrors();

    $announcement = Announcement::query()->where('title', 'Кассир')->first();
    $addresses = AnnouncementAdress::where('announcement_id', $announcement->id)->orderBy('id')->get();

    expect($addresses)->toHaveCount(2)
        ->and($addresses[0]->latitude)->toBe(43.237583)
        ->and($addresses[1]->latitude)->toBe(43.25);
});

it('не создаёт строку для пустого адреса', function () {
    postAnnouncement(announcementPayload([
        point(),
        point(['adress' => '', 'without_point' => true]),
    ]))->assertSessionHasErrors('location.1.adress');
});

it('отдаёт координаты на страницу вакансии числами', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $announcement = Announcement::forceCreate([
        'user_id' => $employer->id,
        'type_kz' => 'type',
        'type_ru' => 'тип',
        'title' => 'Кассир',
        'description' => 'описание',
        'payment_type' => 'за месяц',
        'specialization_id' => 1,
        'status' => \App\Enums\AnnouncementStatus::ACTIVE->value,
        'city' => 'Алматы',
    ]);
    AnnouncementAdress::create([
        'announcement_id' => $announcement->id,
        'adress' => 'улица Абая, 150',
        'latitude' => 43.237583,
        'longitude' => 76.883742,
    ]);

    // Связь грузится с явным списком колонок — легко забыть добавить в него
    // новые поля, и тогда координаты молча не доедут до фронта.
    $this->get("/announcement/{$announcement->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('announcement.address.0.latitude', 43.237583)
            ->where('announcement.address.0.longitude', 76.883742)
        );
});

it('не ломает вакансии без координат, созданные раньше', function () {
    $employer = makeUser(Roles::EMPLOYER->value);
    $announcement = Announcement::forceCreate([
        'user_id' => $employer->id,
        'type_kz' => 'type',
        'type_ru' => 'тип',
        'title' => 'Старая вакансия',
        'description' => 'описание',
        'payment_type' => 'за месяц',
        'specialization_id' => 1,
        'status' => \App\Enums\AnnouncementStatus::ACTIVE->value,
        'city' => 'Астана',
    ]);
    AnnouncementAdress::create([
        'announcement_id' => $announcement->id,
        'adress' => 'Момышулы 15/2',
    ]);

    $this->get("/announcement/{$announcement->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('announcement.address.0.latitude', null));
});
