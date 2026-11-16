<?php

use App\Enums\Roles;
use App\Models\PlacementSurvey;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\IOFactory;

test('admin can export placement surveys to an Excel workbook', function () {
    $admin = makeUser(Roles::ADMIN->value);

    PlacementSurvey::query()->create([
        'name' => 'Первый ответ',
        'phone' => '+7 700 000 00 00',
        'position' => 'Кассир',
        'found_via_site' => false,
        'is_graduate' => true,
        'consent' => true,
    ]);

    $survey = PlacementSurvey::query()->create([
        'name' => '=HYPERLINK("https://example.test", "Открыть")',
        'phone' => '+7 700 000 00 01',
        'position' => 'Бариста',
        'company' => 'ТОО Ромашка',
        'found_via_site' => true,
        'is_graduate' => false,
        'consent' => true,
    ]);
    $survey->created_at = Carbon::parse('2026-10-06 14:30:00');
    $survey->save();

    $this->actingAs($admin)
        ->get(route('admin.placement-surveys.index'))
        ->assertOk()
        ->assertSee(route('admin.placement-surveys.export'), false)
        ->assertSeeText('Выгрузить в Excel');

    $response = $this->actingAs($admin)
        ->get(route('admin.placement-surveys.export'));

    $response->assertOk()->assertDownload();
    expect($response->headers->get('content-type'))
        ->toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    $path = tempnam(sys_get_temp_dir(), 'placement-surveys-');
    file_put_contents($path, $response->streamedContent());

    $spreadsheet = IOFactory::load($path);

    try {
        $sheet = $spreadsheet->getActiveSheet();

        expect($sheet->getTitle())->toBe('Опросы')
            ->and($sheet->getCell('A1')->getValue())->toBe('ID')
            ->and($sheet->getCell('E1')->getValue())->toBe('Компания, в которую трудоустроился')
            ->and($sheet->getCell('I1')->getValue())->toBe('Дата создания')
            ->and($sheet->getCell('B2')->getValue())->toBe('=HYPERLINK("https://example.test", "Открыть")')
            ->and($sheet->getCell('B2')->getDataType())->toBe(DataType::TYPE_STRING)
            ->and($sheet->getCell('C2')->getValue())->toBe('+7 700 000 00 01')
            ->and($sheet->getCell('B3')->getValue())->toBe('Первый ответ')
            ->and($sheet->getCell('E2')->getValue())->toBe('ТОО Ромашка')
            // У записи без компании ячейка пустая. PhpSpreadsheet отдаёт её
            // как null; важно, что туда не утекла строка «null» — от этого
            // бережёт приведение (string) в addExportRow().
            ->and($sheet->getCell('E3')->getValue())->toBeNull()
            ->and($sheet->getCell('F2')->getValue())->toBe('Да')
            ->and($sheet->getCell('G2')->getValue())->toBe('Нет')
            ->and($sheet->getCell('H2')->getValue())->toBe('Да')
            ->and($sheet->getCell('I2')->getFormattedValue())->toBe('06.10.2026 14:30:00');
    } finally {
        $spreadsheet->disconnectWorksheets();
        unlink($path);
    }
});

test('only admins and moderators can export placement surveys', function () {
    $this->get(route('admin.placement-surveys.export'))
        ->assertRedirect(route('admin.login'));

    $employee = makeUser(Roles::EMPLOYEE->value);

    $this->actingAs($employee)
        ->get(route('admin.placement-surveys.export'))
        ->assertRedirect(route('admin.login'));

    $moderator = makeUser(Roles::MODERATOR->value);

    $this->actingAs($moderator)
        ->get(route('admin.placement-surveys.export'))
        ->assertOk();
});
