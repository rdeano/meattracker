<?php

namespace App\Http\Controllers;

use App\Models\Cut;
use App\Models\HangoItem;
use App\Models\HangoTransaction;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HangoController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $transactions = HangoTransaction::with('items.cut', 'supplier')
            ->whereDate('date', $date)
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'date' => $t->date->format('Y-m-d'),
                'supplier_name' => $t->supplier_name ?? $t->supplier?->name,
                'total' => $t->items->sum('total'),
                'items' => $t->items->map(fn($i) => [
                    'id' => $i->id,
                    'cut_name' => $i->cut->name,
                    'kilo' => $i->kilo,
                    'price_per_kilo' => $i->price_per_kilo,
                    'total' => $i->total,
                ]),
            ]);

        return Inertia::render('Hango/Index', [
            'transactions' => $transactions,
            'date' => $date,
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
            'cuts' => Cut::where('type', 'meat')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'supplier_name' => 'nullable|string|max:150',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'items' => 'required|array|min:1',
            'items.*.cut_id' => 'required|exists:cuts,id',
            'items.*.kilo' => 'required|numeric|min:0',
            'items.*.price_per_kilo' => 'required|numeric|min:0',
        ]);

        $transaction = HangoTransaction::create([
            'date' => $data['date'],
            'supplier_name' => $data['supplier_name'] ?? null,
            'supplier_id' => $data['supplier_id'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            $transaction->items()->create([
                'cut_id' => $item['cut_id'],
                'kilo' => $item['kilo'],
                'price_per_kilo' => $item['price_per_kilo'],
                'total' => round($item['kilo'] * $item['price_per_kilo'], 2),
            ]);
        }

        return back()->with('success', 'Hango transaction saved.');
    }

    public function addItems(Request $request, HangoTransaction $hango)
    {
        $data = $request->validate([
            'items'                  => 'required|array|min:1',
            'items.*.cut_id'         => 'required|exists:cuts,id',
            'items.*.kilo'           => 'required|numeric|min:0',
            'items.*.price_per_kilo' => 'required|numeric|min:0',
        ]);

        foreach ($data['items'] as $item) {
            $hango->items()->create([
                'cut_id'         => $item['cut_id'],
                'kilo'           => $item['kilo'],
                'price_per_kilo' => $item['price_per_kilo'],
                'total'          => round($item['kilo'] * $item['price_per_kilo'], 2),
            ]);
        }

        return back()->with('success', 'Items added.');
    }

    public function destroy(HangoTransaction $hango)
    {
        $hango->items()->delete();
        $hango->delete();

        return back()->with('success', 'Transaction deleted.');
    }

    public function destroyItem(HangoItem $item)
    {
        $item->delete();

        return back()->with('success', 'Item deleted.');
    }
}
