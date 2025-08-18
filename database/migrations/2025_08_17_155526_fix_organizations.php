<?php

use App\Models\Organization;
use App\Models\Specialization;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $organizations = Organization::all();
        foreach ($organizations as $organization) {
            $specialization         = Specialization::query()->find($organization->position_id);
            $organization->position = $specialization->name_ru;

            $organization->save();
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
