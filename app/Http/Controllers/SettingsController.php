<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'default_meat_price_per_kg' => Setting::get('default_meat_price_per_kg', ''),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'default_meat_price_per_kg' => 'required|numeric|min:0',
        ]);

        Setting::set('default_meat_price_per_kg', $data['default_meat_price_per_kg']);

        return back()->with('success', 'Settings saved.');
    }
}
