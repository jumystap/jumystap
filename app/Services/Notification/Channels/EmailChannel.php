<?php
namespace App\Services\Notification\Channels;

interface EmailChannel
{
    public function send(string $to, string $subject, string $message): bool;
}
