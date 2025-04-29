<?php

namespace App\Telegram;

use App\Enums\AnnouncementStatus;
use App\Models\Announcement;
use App\Models\TelegramAdmin;
use DefStudio\Telegraph\Handlers\WebhookHandler;
use DefStudio\Telegraph\Models\TelegraphChat;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Stringable;

class Handler extends WebhookHandler
{
    public function start() : void
    {
        $chat = $this->chat;

//        if(false){
            if ($chat instanceof TelegraphChat) {
                Telegraph::chat($chat)
                    ->message('Добро пожаловать!')
                    ->send();

                $telegramAdmin = TelegramAdmin::where('chat_id', (string)$chat->chat_id)->first();


                if(!$telegramAdmin){
                    TelegramAdmin::create([
                        'chat_id' => (string)$chat->chat_id,
                        'name' => (string)$this->message->from()->username(),
                    ]);
                }
            } else {
                $this->reply('Чат не найден');
            }
//        } else {
//            $this->reply('Добро пожаловать');
//        }
    }

    public function help(): void
    {
        $this->reply("we can't help " . $this->chat->chat_id);
    }

    protected function handleUnknownCommand(Stringable $text): void
    {
        $this->reply('Неизвестная команда');
    }

    public function accept()
    {
        try {
            $id = $this->data->get('id');
            $chat_id = $this->data->get('chat_id');
            $announcement = Announcement::findOrFail($id);
            $announcement->status = AnnouncementStatus::ACTIVE->value;
            $announcement->published_at = now();
            $announcement->save();

            Log::info('Announcement accepted and activated.', ['announcement_id' => $announcement->id]);

            Telegraph::chat($chat_id)
                ->message("Объявление ID {$announcement->id} успешно принято и активировано.")
                ->send();

            return response()->json(['status' => 'success', 'message' => 'Announcement accepted and activated.']);
        } catch (\Exception $e) {
            Log::error('Failed to accept the announcement.', ['announcement_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['status' => 'error', 'message' => 'Failed to accept the announcement.'], 500);
        }
    }

    public function reject()
    {
        try {
            $id = $this->data->get('id');
            $chat_id = $this->data->get('chat_id');
            $announcement = Announcement::findOrFail($id);
            $announcement->status = AnnouncementStatus::BLOCKED->value;
            $announcement->save();

            Log::info('Announcement rejected and deactivated.', ['announcement_id' => $announcement->id]);

            Telegraph::chat($chat_id)
                ->message("Объявление ID {$announcement->id} отклонено и деактивировано.")
                ->send();

            return response()->json(['status' => 'success', 'message' => 'Announcement rejected and deactivated.']);
        } catch (\Exception $e) {
            Log::error('Failed to reject the announcement.', ['announcement_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['status' => 'error', 'message' => 'Failed to reject the announcement.'], 500);
        }
    }
}
