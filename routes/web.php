<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ✅ Import controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\AvailabilityController;
use App\Http\Controllers\Admin\BookingAdminController;
use App\Http\Controllers\Admin\DashboardController; // make sure this is at the top with your other use lines

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Optional example pages (keep if you use them)
Route::get('/homepage', function () {
    return Inertia::render('Homepage');
})->middleware(['auth', 'verified'])->name('homepage');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// (You can keep this if you have a plain BookingPage.jsx you want to view)
Route::get('/bookingpage', function () {
    return Inertia::render('BookingPage');
})->middleware(['auth', 'verified'])->name('bookingpage');

// Gallery
Route::get('/gallery', function () {
    return Inertia::render('Gallery');
})->middleware(['auth', 'verified'])->name('gallery');

// CheckBooking
Route::get('/checkbooking', function () {
    return Inertia::render('CheckBooking');
})->middleware(['auth', 'verified'])->name('checkbooking');

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Booking flow
Route::get('/booking', [BookingController::class, 'index'])->name('booking.index');
Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');
Route::post('/booking/{booking}/confirm', [BookingController::class, 'confirm'])->name('booking.confirm');

// Admin (protect with auth/verified)
// Admin (protect with auth/verified)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Bookings (read-only list)
    Route::get('/bookings', [BookingAdminController::class, 'index'])->name('bookings.index');

    // Packages management
    Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');
    Route::post('/packages', [PackageController::class, 'store'])->name('packages.store');
    Route::patch('/packages/{package}', [PackageController::class, 'update'])->name('packages.update');
    Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->name('packages.destroy');

    // 🔐 Image upload endpoint (POST) — this is the one your uploader calls
    Route::post('/packages/upload-image', [PackageController::class, 'uploadImage'])->name('packages.upload');

    // Available Dates (Availability)
    Route::get('/availability', [AvailabilityController::class, 'index'])->name('availability.index');
    Route::post('/availability', [AvailabilityController::class, 'store'])->name('availability.store');
    Route::delete('/availability/{availability}', [AvailabilityController::class, 'destroy'])->name('availability.destroy');
});


// Auth routes (Breeze/Fortify/etc.)
require __DIR__ . '/auth.php';
