<?php

namespace App\Services;

use App\Models\PlacementSurvey;
use App\Repositories\PlacementSurveyRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PlacementSurveyService
{
    public function __construct(private PlacementSurveyRepository $placementSurveyRepository) {}

    public function submit(array $data): PlacementSurvey
    {
        return $this->placementSurveyRepository->create($data);
    }

    public function paginateForAdmin(int $perPage = 100): LengthAwarePaginator
    {
        return $this->placementSurveyRepository->paginateForAdmin($perPage);
    }

    public function exportForAdmin(): StreamedResponse
    {
        return response()->streamDownload(function (): void {
            $spreadsheet = new Spreadsheet;

            try {
                $sheet = $spreadsheet->getActiveSheet();
                $sheet->setTitle('Опросы');
                $this->addExportHeader($sheet);

                $row = 2;

                foreach ($this->placementSurveyRepository->cursorForExport() as $survey) {
                    $this->addExportRow($sheet, $row, $survey);
                    $row++;
                }

                $this->formatExportSheet($sheet, $row - 1);

                (new Xlsx($spreadsheet))->save('php://output');
            } finally {
                $spreadsheet->disconnectWorksheets();
            }
        }, 'placement-surveys-'.now()->format('Y-m-d_H-i-s').'.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    private function addExportHeader(Worksheet $sheet): void
    {
        $headers = [
            'A' => 'ID',
            'B' => 'Имя',
            'C' => 'Телефон',
            'D' => 'Позиция',
            'E' => 'Работа через JUMYSTAP',
            'F' => 'Курсы JOLTAP',
            'G' => 'Согласие',
            'H' => 'Дата создания',
        ];

        foreach ($headers as $column => $header) {
            $sheet->setCellValueExplicit("{$column}1", $header, DataType::TYPE_STRING);
        }
    }

    private function addExportRow(Worksheet $sheet, int $row, PlacementSurvey $survey): void
    {
        $sheet->setCellValueExplicit("A{$row}", $survey->id, DataType::TYPE_NUMERIC);
        $sheet->setCellValueExplicit("B{$row}", $survey->name, DataType::TYPE_STRING);
        $sheet->setCellValueExplicit("C{$row}", $survey->phone, DataType::TYPE_STRING);
        $sheet->setCellValueExplicit("D{$row}", $survey->position, DataType::TYPE_STRING);
        $sheet->setCellValueExplicit("E{$row}", $survey->found_via_site ? 'Да' : 'Нет', DataType::TYPE_STRING);
        $sheet->setCellValueExplicit("F{$row}", $survey->is_graduate ? 'Да' : 'Нет', DataType::TYPE_STRING);
        $sheet->setCellValueExplicit("G{$row}", $survey->consent ? 'Да' : 'Нет', DataType::TYPE_STRING);
        $sheet->setCellValue("H{$row}", Date::PHPToExcel($survey->created_at));
    }

    private function formatExportSheet(Worksheet $sheet, int $lastRow): void
    {
        $sheet->freezePane('A2');
        $sheet->getStyle('A1:H1')->getFont()->setBold(true)->getColor()->setARGB('FFFFFFFF');
        $sheet->getStyle('A1:H1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF1F4E78');
        $sheet->getStyle("A1:H{$lastRow}")->getAlignment()->setVertical(Alignment::VERTICAL_CENTER)->setWrapText(true);

        foreach ([
            'A' => 10,
            'B' => 28,
            'C' => 22,
            'D' => 36,
            'E' => 30,
            'F' => 20,
            'G' => 18,
            'H' => 22,
        ] as $column => $width) {
            $sheet->getColumnDimension($column)->setWidth($width);
        }

        if ($lastRow < 2) {
            return;
        }

        $sheet->setAutoFilter("A1:H{$lastRow}");
        $sheet->getStyle("H2:H{$lastRow}")->getNumberFormat()->setFormatCode('dd.mm.yyyy hh:mm:ss');
    }
}
