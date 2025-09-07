<?php

use App\Http\Controllers\Admin\AnalyticController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\ResponseController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

//Route::get('/admin/login', [AdminController::class, 'login']);
//Route::post('/admin/login', [AdminController::class, 'auth'])->name('admin.login');
//Route::post('/certificates', [CertificateController::class, 'store']);

Route::prefix('admin')->middleware(AdminMiddleware::class)->group(function () {
    Route::get('/', [AdminController::class, 'employers'])->name('admin.dashboard');
    Route::get('/employees', [AdminController::class, 'employees'])->name('admin.employees');
    Route::get('/employers', [AdminController::class, 'employers'])->name('admin.employers');
    Route::get('/companies', [AdminController::class, 'componies'])->name('admin.companies');
    Route::get('/certificates', [AdminController::class, 'certificates'])->name('admin.certificates');
    Route::get('/logout', [AdminController::class, 'logout'])->name('admin.logout');
});

// Authentication Routes...
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::prefix('admin')->name('admin.')->middleware(AdminMiddleware::class)->group(function () {
    Route::group(['prefix' => '/account', 'as' => 'account.'], function () {
        Route::get('/', [AccountController::class, 'index'])->name('index');
        Route::put('/update', [AccountController::class, 'update'])->name('update');
    });

    Route::get('/index', [HomeController::class, 'index'])->name('index');
    Route::resource('users', UserController::class);
    Route::resource('announcements', AnnouncementController::class);
    Route::resource('certificates', \App\Http\Controllers\Admin\CertificateController::class);
    Route::prefix('analytics')->name('analytics.')->group(function (){
        Route::get('clicks', [AnalyticController::class, 'clicks'])->name('clicks');
    });
    Route::prefix('responses')->name('responses.')->group(function (){
        Route::get('', [ResponseController::class, 'index'])->name('index');
    });
});
