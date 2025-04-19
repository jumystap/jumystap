<?php
namespace App\Services\Notification\Channels;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmscChannel implements SmsChannel
{
    private string $login;
    private string $password;
    private string $baseUri;

    public function __construct()
    {
        $this->baseUri = config('services.smsc.base_uri');
        $this->login = config('services.smsc.login');
        $this->password = config('services.smsc.password');
    }

    public function send(string $to, string $message): bool
    {
        try {
            $response = Http::get($this->baseUri . '/sys/send.php', [
                'login'    => $this->login,
                'psw'      => $this->password,
                'phones'   => $to,
                'mes'      => $message,
                'fmt'      => 3,
            ]);

            $result = $response->json();

            if (isset($result['error'])) {
                Log::error("SMSC Error: " . $result['error']);
                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error("SMSC Exception: " . $e->getMessage());
            return false;
        }
    }
}

