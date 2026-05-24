<?php

namespace App\Http\Controllers;

use App\Models\Cut;
use App\Models\EntrailsSale;
use App\Models\Suki;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EntrailsSalesController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $records = EntrailsSale::with('cut', 'suki')
            ->whereDate('date', $date)
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'date' => $r->date->format('Y-m-d'),
                'customer_name' => $r->customer_name ?? $r->suki?->name,
                'cut_name' => $r->cut->name,
                'kilo' => $r->kilo,
                'price_per_kilo' => $r->price_per_kilo,
                'total' => $r->total,
                'payment_type' => $r->payment_type,
            ]);

        return Inertia::render('Entrails/Index', [
            'records' => $records,
            'date' => $date,
            'total' => $records->sum('total'),
            'sukis' => Suki::orderBy('name')->get(['id', 'name']),
            'cuts' => Cut::where('type', 'entrails')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'customer_name' => 'nullable|string|max:150',
            'suki_id' => 'nullable|exists:suki,id',
            'cut_id' => 'required|exists:cuts,id',
            'kilo' => 'required|numeric|min:0',
            'price_per_kilo' => 'required|numeric|min:0',
            'payment_type' => 'required|in:cash,credit',
        ]);

        $data['total'] = round($data['kilo'] * $data['price_per_kilo'], 2);

        EntrailsSale::create($data);

        return back()->with('success', 'Entrails sale saved.');
    }

    public function update(Request $request, EntrailsSale $entrail)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'customer_name' => 'nullable|string|max:150',
            'suki_id' => 'nullable|exists:suki,id',
            'cut_id' => 'required|exists:cuts,id',
            'kilo' => 'required|numeric|min:0',
            'price_per_kilo' => 'required|numeric|min:0',
            'payment_type' => 'required|in:cash,credit',
        ]);

        $data['total'] = round($data['kilo'] * $data['price_per_kilo'], 2);

        $entrail->update($data);

        return back()->with('success', 'Record updated.');
    }

    public function destroy(EntrailsSale $entrail)
    {
        $entrail->delete();

        return back()->with('success', 'Record deleted.');
    }
}
