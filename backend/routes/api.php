<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::group(['namespace' => 'App\Http\Controllers'])
Route::group(['namespace' => 'App\Http\Controllers'], function () {
    Route::post('/register', AuthController::class . '@register');
    Route::post('/login', AuthController::class . '@login');

    Route::post('/forgot-password', AuthController::class . '@resetPasswordRequest');
    Route::post('/validate-reset-code', AuthController::class . '@validateResetPasswordCode');
    Route::post('/reset-password', AuthController::class . '@resetPassword');

    Route::get('/email/verify/{id}/{hash}', AuthController::class . '@verifyEmail')->name('verification.verify');
});

Route::group(['prefix' => 'u', 'namespace' => 'App\Http\Controllers', 'middleware' => 'auth:sanctum'], function () {
    Route::apiResource('tasks', TaskController::class);
});



Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', AuthController::class . '@logout');
    Route::post('/validate-token', AuthController::class . '@validateToken');
    Route::post('/email/verify', AuthController::class . '@verifyRequest')->name('verification.send');
});
