<?php

namespace App\Console\Commands;

use App\Models\UserProfession;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class DeleteCertificatesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-certificates {type}';

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

        $certificates = UserProfession::query()
            ->where('type', $type)
            ->get();

        foreach ($certificates as $certificate) {
            $path     = $type == 'digital' ? "digital_certificates.certificates.list?id={$certificate->bitrix_id}" : "working_certificates.certificates.list?id={$certificate->bitrix_id}";
            $response = Http::get($baseUri . $path);

            if ($response->successful()) {
                $data = $response->json();
                if (empty($data['result'])) {

                    $user = $certificate->user;
                    if(count($user->professions) == 1){
                        $user->update(['is_graduate' => 0]);
                    }

                    $certificate->delete();
                }
            }
        }
    }
}
