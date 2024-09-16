<?php

namespace App\Jobs;

use App\Models\Visit;
use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TrackVisitJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $user;
    public $url;
    public $ip;
    public $deviceType;

    public function __construct($user, $url, $ip, $deviceType)
    {
        $this->user = $user;
        $this->url = $url;
        $this->ip = $ip;
        $this->deviceType = $deviceType;
    }

    public function handle()
    {
        try {
            Visit::create([
                'user_id' => $this->user,
                'url' => $this->url,
                'ip_address' => $this->ip,
                'device_type' => $this->deviceType,
            ]);
        } catch (\Exception $e) {
            Log::error('TrackVisitJob failed: ' . $e->getMessage());
        }
    }

}

