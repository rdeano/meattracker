<?php

namespace App\Http\Controllers;

use App\Models\CashSalesItem;
use App\Models\CashSalesTransaction;
use App\Models\Cut;
use App\Models\Suki;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashSalesController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $transactions = CashSalesTransaction::with('items.cut', 'suki')
            ->whereDate('date', $date)
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'date' => $t->date->format('Y-m-d'),
                'customer_name' => $t->customer_name ?? $t->suki?->name,
                'total' => $t->items->sum('total'),
                'items' => $t->items->map(fn($i) => [
                    'id' => $i->id,
                    'cut_name' => $i->cut->name,
                    'kilo' => $i->kilo,
                    'price_per_kilo' => $i->price_per_kilo,
                    'total' => $i->total,
                ]),
            ]);

        return Inertia::render('CashSales/Index', [
            'transactions' => $transactions,
            'date' => $date,
            'sukis' => Suki::orderBy('name')->get(['id', 'name']),
            'cuts' => Cut::where('type', 'meat')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'customer_name' => 'nullable|string|max:150',
            'suki_id' => 'nullable|exists:suki,id',
            'items' => 'required|array|min:1',
            'items.*.cut_id' => 'required|exists:cuts,id',
            'items.*.kilo' => 'required|numeric|min:0',
            'items.*.price_per_kilo' => 'required|numeric|min:0',
        ]);

        $transaction = CashSalesTransaction::create([
            'date' => $data['date'],
            'customer_name' => $data['customer_name'] ?? null,
            'suki_id' => $data['suki_id'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            $transaction->items()->create([
                'cut_id' => $item['cut_id'],
                'kilo' => $item['kilo'],
                'price_per_kilo' => $item['price_per_kilo'],
                'total' => round($item['kilo'] * $item['price_per_kilo'], 2),
            ]);
        }

        return back()->with('success', 'Cash sale saved.');
    }

    public function destroy(CashSalesTransaction $cashSale)
    {
        $cashSale->items()->delete();
        $cashSale->delete();

        return back()->with('success', 'Transaction deleted.');
    }

    public function destroyItem(CashSalesItem $item)
    {
        $item->delete();

        return back()->with('success', 'Item deleted.');
    }
}
