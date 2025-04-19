<?php

use App\Http\Controllers\API\VerificationController;
use App\Http\Controllers\CertificateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/certificates/{id}', [CertificateController::class, 'show']);
Route::post('send-verification-code', [VerificationController::class, 'sendCode'])->name('send-verification-code');
Route::post('verify-code', [VerificationController::class, 'verifyCode'])->name('send-verification-code');
