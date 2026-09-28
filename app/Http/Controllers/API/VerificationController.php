<?php

namespace App\Http\Controllers\API;

use App\Enums\NotificationChannel;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\User\SendCodeRequest;
use App\Http\Requests\API\User\VerifyCodeRequest;
use App\Models\Code;
use App\Models\User;
use App\Services\Notification\NotificationService;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class VerificationController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly NotificationService $notificationService) {}

    /**
     * Send receiver verification code
     */
    public function sendCode(SendCodeRequest $request): JsonResponse
    {
        $channel = $request->channel;
        $receiver = $request->receiver;
        $type = $request->type;

        if ($channel == NotificationChannel::SMS->value) {
            $receiver = preg_replace('/\D+/', '', $receiver);

            if ($type == 'forgot') {
                $phoneExist = User::query()->where('phone', $receiver)->exists();
                if (! $phoneExist) {
                    return $this->sendResponseError(trans('verification.user_not_registered'));
                }
            }
            if ($type == 'register') {
                // Ищем и среди удалённых: при удалении через админку телефон
                // освобождается префиксом deleted_ только у незаблокированных.
                // У заблокированных он остаётся занятым, и регистрация всё равно
                // упрётся в unique-правило — без withTrashed мы бы впустую
                // отправили им SMS и показали ошибку только на последнем шаге.
                $phoneExist = User::query()->withTrashed()->where('phone', $receiver)->exists();
                if ($phoneExist) {
                    return $this->sendResponseError(trans('verification.user_already_registered'));
                }
            }
        }

        $sentCodes = Code::query()
            ->where(['receiver' => $receiver, 'type' => $type])
            ->whereDate('created_at', today())
            ->withTrashed()
            ->count();
        if ($sentCodes > 5) {
            return $this->sendResponseError(trans('verification.limit'));
        }

        $codeExist = Code::query()->firstWhere(['receiver' => $receiver, 'type' => $type]);
        if ($codeExist) {
            $createdAt = Carbon::parse($codeExist->created_at);
            $now = Carbon::now();
            $estimatedSeconds = 60 - $createdAt->diffInSeconds($now);
            if ($estimatedSeconds > 0) {
                return $this->sendResponseError(__('verification.after', ['estimated_seconds' => ceil($estimatedSeconds)]));
            } else {
                $codeExist->delete();
            }
        }

        $rand = mt_rand(100000, 999999);

        $response = $this->notificationService->sendSms($receiver, 'JOLTAP Ваш код: '.$rand);
        if (! $response) {
            return $this->sendResponseError(__('verification.error'));
        } else {
            $data = [
                'channel' => $channel,
                'receiver' => $receiver,
                'code' => $rand,
                'type' => $type,
            ];
            Code::query()->create($data);
        }

        return $this->sendResponseSuccess(trans('verification.sent'));
    }

    public function verifyCode(VerifyCodeRequest $request): JsonResponse
    {
        $channel = $request->channel;
        $receiver = $request->receiver;
        $type = $request->type;
        $code = $request->code;

        if ($channel === NotificationChannel::SMS->value) {
            $receiver = preg_replace('/\D+/', '', $receiver);
        }

        $codeExist = Code::firstWhere(['receiver' => $receiver, 'type' => $type, 'code' => $code]);
        if ($codeExist) {
            $codeExist->delete();

            return $this->sendResponseSuccess(trans('verification.success'));
        }

        $oldCodes = Code::query()
            ->where(['receiver' => $receiver, 'type' => $type, 'code' => $code])
            ->whereDate('created_at', today())
            ->withTrashed()
            ->count();

        if ($oldCodes > 0) {
            return $this->sendResponseError(__('verification.code_expired'));
        }

        return $this->sendResponseError(trans('verification.error'));
    }
}
