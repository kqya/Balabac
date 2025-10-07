<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AvailableDate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Availability/Index', [
            'dates' => AvailableDate::orderBy('date')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => ['required','date','after_or_equal:today','unique:available_dates,date'],
            'note' => ['nullable','string','max:255'],
        ]);

        AvailableDate::create($data);
        return back();
    }

    public function destroy(AvailableDate $availability)
    {
        $availability->delete();
        return back();
    }
}
