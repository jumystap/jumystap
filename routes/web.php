<?php

use App\Http\Controllers\AnalyticController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfessionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ResumeController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserResumeController;
use Illuminate\Support\Facades\Route;
use DefStudio\Telegraph\Facades\Telegraph;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/terms', [HomeController::class, 'terms']);
Route::get('/employees', [UserController::class, 'index'])->name('employees');
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'create']);
Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements');
Route::get('/announcement/update/{id}', [AnnouncementController::class, 'edit']);
Route::put('/announcements/{id}', [AnnouncementController::class, 'update'])->name('announcements.update');
Route::get('/profession/{group}', [ProfessionController::class, 'index'])->name('profession');
Route::get('/faq', [HomeController::class, 'faq'])->name('faq');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/announcement/{id}', [AnnouncementController::class, 'show'])->name('announcement');
Route::delete('/announcements/{id}', [AnnouncementController::class, 'delete'])->name('announcements.delete');
Route::get('/connect/{employee_id}/{announcement_id}', [AnnouncementController::class, 'response'])->name('announcement');
Route::get('/rate/{employee_id}/{rating}', [UserController::class, 'rate'])->name('rate.user');
Route::post('/send-feedback', [FeedbackController::class, 'sendFeedback']);
Route::get('/forgot_password', [AuthController::class, 'forgetPassword']);
Route::post('/restore_password', [AuthController::class, 'restorePassword']);

Route::prefix('analytics')->name('analytics.')->group(function (){
    Route::post('click', [AnalyticController::class, 'create'])->name('click.create');
});

Route::prefix('portfolio')->middleware('auth')->group(function() {
    Route::post('/', [PortfolioController::class, 'store'])->name('portfolio.store');
    Route::delete('/{id}', [PortfolioController::class, 'delete'])->name('portfolio.delete');
});

Route::get('/login', [UserController::class, 'login'])->name('login');
Route::post('/login', [UserController::class, 'auth'])->name('auth');
Route::get('/register', [UserController::class, 'register'])->name('register');
Route::post('/register', [UserController::class, 'store'])->name('store');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');
Route::get('/user/{id}', [UserController::class, 'show'])->name('user');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [UserController::class, 'profile'])->name('profile');
    Route::get('/my-responses', [UserController::class, 'responses'])->name('responses');
    Route::post('/update', [UserController::class, 'update'])->name('update');
    Route::get('/fav', [FavoriteController::class, 'index']);
    Route::post('/fav/{id}', [FavoriteController::class, 'store'])->name('fav.store');
    Route::delete('/fav/{id}', [FavoriteController::class, 'delete'])->name('fav.delete');
    Route::get('/update', [UserController::class, 'edit'])->name('edit');
    Route::post('/create_announcement', [AnnouncementController::class, 'create']);
    Route::get('/create_announcement', [AnnouncementController::class, 'store']);
    Route::get('/profile/announcement/{id}', [UserController::class, 'myAnnouncement']);
    Route::post('/resume', [ResumeController::class, 'create']);
    Route::get('/create_resume', [UserResumeController::class, 'create']);
    Route::post('/create_resume', [UserResumeController::class, 'store']);
    Route::get('/update_resume/{id}', [UserResumeController::class, 'edit']);
    Route::post('/update_resume/{id}', [UserResumeController::class, 'update']);
    Route::get('/resume/{id}', [UserResumeController::class, 'show']);
    Route::get('/chat', [HomeController::class, 'chat']);
    Route::post('/announcements/archive', [AnnouncementController::class, 'archive'])->name('announcement.archive');
    Route::post('/announcements/republish', [AnnouncementController::class, 'republish'])->name('announcement.republish');
    Route::delete('/delete_resume/{id}', [UserResumeController::class, 'destroy'])->name('delete_resume');
});


Route::post('/telegram/webhook', function () {
    Telegraph::handleWebhook();
    return response()->json(['status' => 'success']);
});

require __DIR__.'/admin.php';
