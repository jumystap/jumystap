<?php
namespace App\Services\Notification;

use App\Services\Notification\Channels\SmsChannel;

class NotificationService
{
    public function __construct(
        private readonly SmsChannel $smsChannel,
    ) {
    }

    public function sendSms(string $to, string $message): bool
    {
        return $this->smsChannel->send($to, $message);
    }

}
