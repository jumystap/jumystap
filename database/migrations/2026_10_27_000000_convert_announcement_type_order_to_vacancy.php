<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Every announcement on the site is a vacancy, but the create form used to
     * default to «Заказ», so nearly all rows are stored with the wrong type.
     */
    public function up(): void
    {
        // Query builder on purpose: Eloquent would bump updated_at, which drives
        // recentActive(), the auto-archive command and the "Изменено" sort.
        DB::table('announcements')
            ->where('type_ru', 'Заказ')
            ->update([
                'type_ru' => 'Вакансия',
                'type_kz' => 'Вакансия',
            ]);
    }

    public function down(): void
    {
        // Irreversible: after up() there is no way to tell former «Заказ» rows
        // from genuine vacancies, and reverting all of them would corrupt the latter.
    }
};
