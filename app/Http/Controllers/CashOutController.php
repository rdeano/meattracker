<?php

namespace App\Http\Controllers;

use App\Models\CashOut;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashOutController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $records = CashOut::whereDate('date', $date)
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('CashOut/Index', [
            'records' => $records,
            'date' => $date,
            'total' => $records->sum('amount'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:150',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        CashOut::create($data);

        return back()->with('success', 'Cash out saved.');
    }

    public function update(Request $request, CashOut $cashOut)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:150',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $cashOut->update($data);

        return back()->with('success', 'Record updated.');
    }

    public function destroy(CashOut $cashOut)
    {
        $cashOut->delete();

        return back()->with('success', 'Record deleted.');
    }
}
