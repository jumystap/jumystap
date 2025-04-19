<?php

namespace App\Traits;


use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponse
{
    /**
     * @param string $message
     * @param array $data
     * @param int $statusCode
     * @return JsonResponse
     */
    public function sendResponseSuccess(string $message = '', array $data = [], int $statusCode = Response::HTTP_OK): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ];

        return response()->json($response, $statusCode);
    }


    /**
     * @param string $message
     * @param array $errors
     * @param int $statusCode
     * @return JsonResponse
     */
    public function sendResponseError(string $message = '', array $errors = [], int $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
            'errors'  => $errors
        ];

        return response()->json($response, $statusCode);
    }
}
