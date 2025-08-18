<?php

use App\Enums\EducationLevel;
use App\Models\Specialization;
use App\Models\UserResume;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $resumes = UserResume::all();
        foreach ($resumes as $resume) {
            $resume->ip_status = $resume->ip_status == 'Присутствует' ? 1 : 0;
            $specialization    = Specialization::query()->find($resume->desired_field);
            $resume->position  = $specialization->name_ru;

            $resume->education_level_id = EducationLevel::valueFromLabel($resume->education);
            $resume->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
