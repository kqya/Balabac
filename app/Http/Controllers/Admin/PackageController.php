<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Packages/Index', [
            'packages' => Package::orderByDesc('created_at')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'           => ['required','string','max:255'],
            'description'    => ['nullable','string'],
            'image_url'      => ['nullable','string','max:2048'],
            'days'           => ['nullable','integer','min:1','max:365'],
            'nights'         => ['nullable','integer','min:0','max:365'],
            'price_per_head' => ['nullable','numeric','min:0'],
            'min_pax'        => ['required','integer','min:1','max:1000'],
            'inclusions'     => ['nullable'], // tolerate string or array
            'exclusions'     => ['nullable'],
            'add_ons'        => ['nullable'],
            'is_active'      => ['required','boolean'],
        ]);

        // Normalize list fields (accept either array or newline string)
        foreach (['inclusions','exclusions','add_ons'] as $k) {
            if (is_string($data[$k] ?? null)) {
                $data[$k] = array_values(array_filter(preg_split('/\r\n|\r|\n/', $data[$k])));
            }
        }

        // Legacy columns to satisfy schema if present
        $data['duration_minutes'] = $request->input('duration_minutes', 60);
        $data['price']            = $request->input('price', 0);

        Package::create($data);
        return back();
    }

    public function update(Request $request, Package $package)
    {
        $data = $request->validate([
            'name'           => ['sometimes','required','string','max:255'],
            'description'    => ['nullable','string'],
            'image_url'      => ['nullable','string','max:2048'],
            'days'           => ['nullable','integer','min:1','max:365'],
            'nights'         => ['nullable','integer','min:0','max:365'],
            'price_per_head' => ['nullable','numeric','min:0'],
            'min_pax'        => ['sometimes','required','integer','min:1','max:1000'],
            'inclusions'     => ['nullable'],
            'exclusions'     => ['nullable'],
            'add_ons'        => ['nullable'],
            'is_active'      => ['sometimes','required','boolean'],
            // legacy (optional)
            'duration_minutes' => ['nullable','integer','min:1','max:1440'],
            'price'            => ['nullable','numeric','min:0'],
        ]);

        foreach (['inclusions','exclusions','add_ons'] as $k) {
            if (is_string($data[$k] ?? null)) {
                $data[$k] = array_values(array_filter(preg_split('/\r\n|\r|\n/', $data[$k])));
            }
        }

        $package->update($data);
        return back();
    }

    public function destroy(Package $package)
    {
        $package->delete();
        return back();
    }

    /*** -------- Image upload endpoint -------- ***/
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => ['required','image','max:4096'], // <= 4MB
        ]);

        // store to storage/app/public/packages/
        $path = $request->file('image')->store('packages', 'public');

        // return a public URL (requires storage:link once)
        return response()->json(['url' => asset('storage/'.$path)]);
    }
}
