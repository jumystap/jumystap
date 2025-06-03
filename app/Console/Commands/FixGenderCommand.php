<?php

namespace App\Console\Commands;

use App\Enums\Roles;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class FixGenderCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-gender';

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
        $this->info('Started at: ' . date('d.m.Y H:i:s'));

        $baseUri = config('services.gender.uri');
        $key = config('services.gender.key');

        $users = User::query()
            ->where('role_id', Roles::EMPLOYEE->value)
            ->limit(200)
            ->get();

        foreach ($users as $user) {
            $parts = explode(' ', $user->name);
            if (isset($parts[1])) {
                $params = [
                    'name' => $parts[1],
                    'key' => $key,
                ];
                $response = Http::get($baseUri . 'api', $params);

                if ($response->successful()) {
                    $data = $response->json();
                    if (!empty($data)) {
                        $gender = $data['gender'] == 'female' ? 'ж' : 'м';
                        $user->update(['gender' => $gender, 'fixed' => true]);
                        $this->info($user->id . ') ' . $user->name . ' - ' . $gender);
                    }
                }
            } else {
                $this->warn('Error on name: ' . $user->name);
            }
        }

        $this->info('Completed at: ' . date('d.m.Y H:i:s'));
    }
}
