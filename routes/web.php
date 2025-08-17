<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard with statistics
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Book management - accessible to all authenticated users for viewing
    Route::resource('books', BookController::class);
    
    // Borrowing management - accessible to librarians and administrators
    Route::resource('borrowings', BorrowingController::class)->except(['edit']);
    
    // User management - only accessible to administrators
    Route::middleware([\App\Http\Middleware\EnsureUserIsAdmin::class])->group(function () {
        Route::resource('users', UserManagementController::class)->except(['create', 'store']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
