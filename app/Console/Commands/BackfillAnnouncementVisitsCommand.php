<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class BackfillAnnouncementVisitsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:announcement-visits:backfill {--chunk=2000 : Rows per chunk}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backfill announcement_visits from historical visits rows (one-off, idempotent)';

    public function handle(): int
    {
        $chunkSize = (int) $this->option('chunk') ?: 2000;

        $matched = 0;
        $inserted = 0;

        DB::table('visits')
            ->select('id', 'url', 'user_id', 'ip_address', 'device_type', 'created_at')
            ->chunkById($chunkSize, function ($visits) use (&$matched, &$inserted) {
                $rows = [];

                foreach ($visits as $visit) {
                    // Только публичная страница вакансии; /profile/announcement/{id} исключаем.
                    if (! preg_match('#^https?://[^/]+/announcement/(\d+)#', (string) $visit->url, $m)) {
                        continue;
                    }

                    $rows[] = [
                        'announcement_id' => (int) $m[1],
                        'user_id' => $visit->user_id,
                        'ip_address' => $visit->ip_address,
                        'device_type' => $visit->device_type,
                        'source_visit_id' => $visit->id,
                        'created_at' => $visit->created_at,
                    ];
                }

                $matched += count($rows);

                if ($rows !== []) {
                    // insertOrIgnore: пропускает уже перенесённые (unique source_visit_id)
                    // и строки на удалённые вакансии (FK) — команда перезапускаема.
                    $inserted += DB::table('announcement_visits')->insertOrIgnore($rows);
                }
            });

        $this->info("Matched announcement visits: {$matched}");
        $this->info("Inserted (new) rows: {$inserted}");
        $this->info('Skipped (duplicates or missing announcement): '.($matched - $inserted));

        return self::SUCCESS;
    }
}
