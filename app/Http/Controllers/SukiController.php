<?php

namespace App\Http\Controllers;

use App\Models\Cut;
use App\Models\Suki;
use App\Services\SukiLedgerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SukiController extends Controller
{
    public function index(): Response
    {
        $sukis = Suki::orderBy('name')->get();

        return Inertia::render('Suki/Index', ['sukis' => $sukis]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'contact' => 'nullable|string|max:100',
        ]);

        Suki::create($data);

        return back()->with('success', 'Suki added.');
    }

    public function update(Request $request, Suki $suki)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'contact' => 'nullable|string|max:100',
        ]);

        $suki->update($data);

        return back()->with('success', 'Suki updated.');
    }

    public function destroy(Suki $suki)
    {
        $suki->delete();

        return back()->with('success', 'Suki deleted.');
    }

    public function ledger(Suki $suki, SukiLedgerService $service): Response
    {
        $cuts = Cut::orderByRaw("FIELD(type,'meat','entrails')")->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Suki/Ledger', array_merge(
            $service->getLedger($suki),
            ['cuts' => $cuts]
        ));
    }
}
