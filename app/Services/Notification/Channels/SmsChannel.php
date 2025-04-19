<?php
namespace App\Services\Notification\Channels;

interface SmsChannel
{
    public function send(string $to, string $message): bool;
}
