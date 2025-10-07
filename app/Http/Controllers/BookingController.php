<?php

namespace App\Http\Controllers;

use App\Models\AvailableDate;
use App\Models\Booking;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        // Get active packages with ALL columns (image_url, days/nights, price_per_head, inclusions, etc.)
        $packages = Package::query()
            ->where('is_active', true)
            ->orderByRaw('COALESCE(price_per_head, price) ASC')
            ->get(); // <-- no column restriction so frontend receives all fields

        // Available dates (only these can be picked)
        $availableDates = AvailableDate::query()
            ->orderBy('date')
            ->get(['date'])
            ->pluck('date')
            ->map(fn ($d) => $d->format('Y-m-d'));

        return Inertia::render('Booking/Index', [
            'packages'       => $packages,
            'availableDates' => $availableDates,
            'step'           => (int) $request->integer('step', 1),
            'bookingId'      => $request->query('booking_id'),
            'status'         => $request->query('status'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'package_id'     => ['required', Rule::exists('packages', 'id')->where('is_active', true)],
            'booking_date'   => ['required', 'date', 'after_or_equal:today'],
            'customer_name'  => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
            'num_people'     => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        // Allow only dates that exist in available_dates
        $date = Carbon::parse($data['booking_date'])->toDateString();
        if (!AvailableDate::query()->where('date', $date)->exists()) {
            return back()->withErrors(['booking_date' => 'Selected date is not available. Please choose another date.']);
        }

        $package = Package::findOrFail($data['package_id']);

        // Use price_per_head if set; otherwise fall back to legacy price
        $unitPrice = $package->price_per_head ?? $package->price ?? 0;
        $amount    = $unitPrice * (int) $data['num_people'];

        $booking = Booking::create([
            ...$data,
            'amount'  => $amount,
            'status'  => 'pending',
        ]);

        return redirect()->route('booking.index', ['step' => 3, 'booking_id' => $booking->id]);
    }

    public function confirm(Request $request, Booking $booking)
    {
        abort_unless($booking->status === 'pending', 403, 'Cannot confirm this booking.');

        // Mock payment success
        $booking->status = 'paid';
        $booking->payment_reference = 'MOCK-' . strtoupper(uniqid());
        $booking->save();

        return redirect()->route('booking.index', [
            'step'       => 3,
            'booking_id' => $booking->id,
            'status'     => 'paid',
        ]);
    }
}
