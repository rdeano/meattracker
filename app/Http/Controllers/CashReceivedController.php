<?php

namespace App\Http\Controllers;

use App\Models\CashReceived;
use App\Models\Suki;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashReceivedController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $records = CashReceived::with('suki')
            ->whereDate('date', $date)
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'date' => $r->date->format('Y-m-d'),
                'name' => $r->name ?? $r->suki?->name,
                'amount' => $r->amount,
                'notes' => $r->notes,
            ]);

        return Inertia::render('CashReceived/Index', [
            'records' => $records,
            'date' => $date,
            'total' => $records->sum('amount'),
            'sukis' => Suki::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'name' => 'nullable|string|max:150',
            'suki_id' => 'nullable|exists:suki,id',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        CashReceived::create($data);

        return back()->with('success', 'Cash received saved.');
    }

    public function update(Request $request, CashReceived $cashReceived)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'name' => 'nullable|string|max:150',
            'suki_id' => 'nullable|exists:suki,id',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $cashReceived->update($data);

        return back()->with('success', 'Record updated.');
    }

    public function destroy(CashReceived $cashReceived)
    {
        $cashReceived->delete();

        return back()->with('success', 'Record deleted.');
    }
}
