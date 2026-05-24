<?php

namespace App\Http\Controllers;

use App\Models\CollectibleItem;
use App\Models\CollectibleTransaction;
use App\Models\Cut;
use App\Models\Suki;
use App\Models\SukiTabEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CollectibleController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $transactions = CollectibleTransaction::with('items.cut', 'suki')
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

        return Inertia::render('Collectibles/Index', [
            'transactions' => $transactions,
            'date' => $date,
            'sukis' => Suki::orderBy('name')->get(['id', 'name']),
            'cuts' => Cut::where('type', 'meat')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'                   => 'required|date',
            'customer_name'          => 'nullable|string|max:150',
            'suki_id'                => 'nullable|exists:suki,id',
            'add_to_suki_tab'        => 'boolean',
            'items'                  => 'required|array|min:1',
            'items.*.cut_id'         => 'required|exists:cuts,id',
            'items.*.kilo'           => 'required|numeric|min:0',
            'items.*.price_per_kilo' => 'required|numeric|min:0',
        ]);

        $syncedToSukiTab = !empty($data['add_to_suki_tab']) && !empty($data['suki_id']);

        $transaction = CollectibleTransaction::create([
            'date'               => $data['date'],
            'customer_name'      => $data['customer_name'] ?? null,
            'suki_id'            => $data['suki_id'] ?? null,
            'synced_to_suki_tab' => $syncedToSukiTab,
        ]);

        foreach ($data['items'] as $item) {
            $transaction->items()->create([
                'cut_id'         => $item['cut_id'],
                'kilo'           => $item['kilo'],
                'price_per_kilo' => $item['price_per_kilo'],
                'total'          => round($item['kilo'] * $item['price_per_kilo'], 2),
            ]);
        }

        // Optionally mirror to suki tab
        if (!empty($data['add_to_suki_tab']) && !empty($data['suki_id'])) {
            $cutNames = Cut::whereIn('id', collect($data['items'])->pluck('cut_id'))
                ->pluck('name', 'id');

            $lines = collect($data['items'])->map(fn($i) =>
                "{$cutNames[$i['cut_id']]} {$i['kilo']}kg × ₱{$i['price_per_kilo']} = ₱" . round($i['kilo'] * $i['price_per_kilo'], 2)
            );

            SukiTabEntry::create([
                'suki_id'     => $data['suki_id'],
                'date'        => $data['date'],
                'description' => $lines->implode(', '),
                'amount'      => round(collect($data['items'])->sum(fn($i) => $i['kilo'] * $i['price_per_kilo']), 2),
            ]);
        }

        return back()->with('success', 'Collectible transaction saved.');
    }

    public function addToSukiTab(CollectibleTransaction $collectible)
    {
        if (!$collectible->suki_id) {
            return back()->with('error', 'No suki linked to this transaction.');
        }

        if ($collectible->synced_to_suki_tab) {
            return back()->with('error', 'This transaction has already been added to the suki tab.');
        }

        $collectible->load('items.cut');

        $lines = $collectible->items->map(fn($i) =>
            "{$i->cut->name} {$i->kilo}kg × ₱{$i->price_per_kilo} = ₱{$i->total}"
        );

        SukiTabEntry::create([
            'suki_id'     => $collectible->suki_id,
            'date'        => $collectible->date->format('Y-m-d'),
            'description' => $lines->implode(', '),
            'amount'      => round($collectible->items->sum('total'), 2),
        ]);

        $collectible->update(['synced_to_suki_tab' => true]);

        return back()->with('success', 'Added to suki tab.');
    }

    public function addItems(Request $request, CollectibleTransaction $collectible)
    {
        $data = $request->validate([
            'items'                   => 'required|array|min:1',
            'items.*.cut_id'          => 'required|exists:cuts,id',
            'items.*.kilo'            => 'required|numeric|min:0',
            'items.*.price_per_kilo'  => 'required|numeric|min:0',
        ]);

        foreach ($data['items'] as $item) {
            $collectible->items()->create([
                'cut_id'          => $item['cut_id'],
                'kilo'            => $item['kilo'],
                'price_per_kilo'  => $item['price_per_kilo'],
                'total'           => round($item['kilo'] * $item['price_per_kilo'], 2),
            ]);
        }

        return back()->with('success', 'Items added.');
    }

    public function destroy(CollectibleTransaction $collectible)
    {
        $collectible->items()->delete();
        $collectible->delete();

        return back()->with('success', 'Transaction deleted.');
    }

    public function destroyItem(CollectibleItem $item)
    {
        $item->delete();

        return back()->with('success', 'Item deleted.');
    }
}
