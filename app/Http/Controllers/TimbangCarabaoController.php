<?php

namespace App\Http\Controllers;

use App\Models\TimbangCarabao;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimbangCarabaoController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $records = TimbangCarabao::whereDate('date', $date)
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Timbang/Index', [
            'records' => $records,
            'date' => $date,
            'total' => $records->sum('total'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'weight_kg' => 'required|numeric|min:0',
            'price_per_kg' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $data['total'] = round($data['weight_kg'] * $data['price_per_kg'], 2);

        TimbangCarabao::create($data);

        return back()->with('success', 'Timbang record saved.');
    }

    public function update(Request $request, TimbangCarabao $timbang)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'weight_kg' => 'required|numeric|min:0',
            'price_per_kg' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $data['total'] = round($data['weight_kg'] * $data['price_per_kg'], 2);

        $timbang->update($data);

        return back()->with('success', 'Timbang record updated.');
    }

    public function destroy(TimbangCarabao $timbang)
    {
        $timbang->delete();

        return back()->with('success', 'Record deleted.');
    }
}
