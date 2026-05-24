<?php

namespace App\Http\Controllers;

use App\Models\Cut;
use App\Models\FreezerIn;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FreezerInController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $records = FreezerIn::with('cut')
            ->whereDate('date', $date)
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'date' => $r->date->format('Y-m-d'),
                'cut_name' => $r->cut->name,
                'weight_kg' => $r->weight_kg,
            ]);

        return Inertia::render('Freezer/InIndex', [
            'records' => $records,
            'date' => $date,
            'total_kg' => $records->sum('weight_kg'),
            'cuts' => Cut::orderBy('name')->get(['id', 'name', 'type']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'cut_id' => 'required|exists:cuts,id',
            'weight_kg' => 'required|numeric|min:0',
        ]);

        FreezerIn::create($data);

        return back()->with('success', 'Freezer in record saved.');
    }

    public function update(Request $request, FreezerIn $freezerIn)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'cut_id' => 'required|exists:cuts,id',
            'weight_kg' => 'required|numeric|min:0',
        ]);

        $freezerIn->update($data);

        return back()->with('success', 'Record updated.');
    }

    public function destroy(FreezerIn $freezerIn)
    {
        $freezerIn->delete();

        return back()->with('success', 'Record deleted.');
    }
}
