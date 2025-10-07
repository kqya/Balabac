<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\AvailableDate;
use App\Models\Booking;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard/Index', [
            'packages' => Package::orderByDesc('created_at')->get(),
            'dates'    => AvailableDate::orderBy('date')->get(),
            'bookings' => Booking::with('package')->orderByDesc('created_at')->get(),
        ]);
    }
}
