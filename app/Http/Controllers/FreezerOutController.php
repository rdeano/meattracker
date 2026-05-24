<?php

namespace App\Http\Controllers;

use App\Models\Cut;
use App\Models\FreezerIn;
use App\Models\FreezerOut;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FreezerOutController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $records = FreezerOut::with('cut')
            ->whereDate('date', $date)
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'date' => $r->date->format('Y-m-d'),
                'cut_name' => $r->cut->name,
                'weight_kg' => $r->weight_kg,
            ]);

        // Individual freezer-in records as options (oldest first — FIFO)
        $freezerInRecords = FreezerIn::with('cut')
            ->orderBy('date')
            ->orderBy('id')
            ->get()
            ->map(fn($r) => [
                'id'        => $r->id,
                'cut_id'    => $r->cut_id,
                'cut_name'  => $r->cut->name,
                'weight_kg' => (float) $r->weight_kg,
                'date'      => $r->date->format('M d'),
            ]);

        return Inertia::render('Freezer/OutIndex', [
            'records'          => $records,
            'date'             => $date,
            'total_kg'         => $records->sum('weight_kg'),
            'freezerInRecords' => $freezerInRecords,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'cut_id' => 'required|exists:cuts,id',
            'weight_kg' => 'required|numeric|min:0',
        ]);

        FreezerOut::create($data);

        return back()->with('success', 'Freezer out record saved.');
    }

    public function update(Request $request, FreezerOut $freezerOut)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'cut_id' => 'required|exists:cuts,id',
            'weight_kg' => 'required|numeric|min:0',
        ]);

        $freezerOut->update($data);

        return back()->with('success', 'Record updated.');
    }

    public function destroy(FreezerOut $freezerOut)
    {
        $freezerOut->delete();

        return back()->with('success', 'Record deleted.');
    }
}
