<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\UserProfession;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class GetCertificatesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:get-certificates {type}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type    = $this->argument('type');
        $baseUri = config('services.bitrix.uri');
        $startId = 0;

        $forStart = UserProfession::query()
            ->where('type', $type)
            ->orderBy('bitrix_id', 'DESC')
            ->first();
        if ($forStart) {
            $startId = $forStart->bitrix_id;
        }

        $stopId = $startId + 100;

        $professionMap = [
            "Швея"                                     => 1,
            "Модельер-конструктор"                     => 2,
            "Бариста"                                  => 3,
            "Продавец-кассир"                          => 4,
            "Основы розничной торговли"                => 4,
            "Основы изготовления корпусной мебели"     => 5,
            "Сборка корпусной мебели"                  => 5,
            "Ремонт обуви и изготовление ключей"       => 6,
            "Электрогазосварщик"                       => 7,
            "Основы бухгалтерского учета"              => 8,
            "SMM"                                      => 9,
            "Мобилограф"                               => 10,
            "Таргетолог"                               => 11,
            "Графический дизайнер"                     => 12,
            "Видеомонтаж"                              => 13,
            "Веб-дизайн + Создание и разработка сайта" => 14,
            "Маркетплейс"                              => 15,
            "Основы торговли на Wildberries"           => 15,
            "Базовые цифровые навыки"                  => 16,
            "Основы торговли на Kaspi магазине"        => 18,
            "Автоспециалист по замене масла и автошин" => 19,
        ];

        for ($i = $startId; $i <= $stopId; $i++) {
            $path     = $type == 'digital' ? "digital_certificates.certificates.list?id={$i}" : "working_certificates.certificates.list?id={$i}";
            $response = Http::get($baseUri . $path);

            if ($response->successful()) {
                $data = $response->json();
                if (!empty($data['result'])) {
                    foreach ($data['result'] as $certificate) {
                        $phone = preg_replace('/\D+/', '', $certificate['PHONE']);
                        $user  = User::query()->where('phone', $phone)->first();
                        if ($user) {
                            $professionId = $professionMap[$this->cleanString($certificate['PROFESSION']['NAME_RU'])] ?? null;
                            if (!$professionId) {
                                $this->warn($certificate['PROFESSION']['NAME_RU'] . " not found!");
                                $this->warn($certificate['PROFESSION']['NAME_KK'] . " not found!");
                                continue;
                            }
                            $params = [
                                'type'               => $type,
                                'bitrix_id'          => $certificate['ID'],
                                'user_id'            => $user->id,
                                'profession_id'      => $professionId,
                                'certificate_number' => $certificate['NUMBER'],
                                'certificate_link'   => $certificate['LINK'],
                            ];
                            UserProfession::query()
                                ->updateOrCreate(
                                    [
                                        'user_id'            => $user->id,
                                        'profession_id'      => $professionId,
                                        'certificate_number' => $certificate['NUMBER'],
                                    ],
                                    $params
                                );
                            $user->update(['is_graduate' => 1]);
                        } else {
                            $this->warn("$phone not found!");
                        }
                    }
                }
            }
        }
    }

    function cleanString($str): string
    {
        // Удаление неразрывных пробелов (включая \u{A0})
        $str = preg_replace('/\x{00A0}/u', ' ', $str);

        // Замена множественных пробелов на один
        $str = preg_replace('/\s+/u', ' ', $str);

        // Обрезка пробелов по краям
        return trim($str);
    }
}
