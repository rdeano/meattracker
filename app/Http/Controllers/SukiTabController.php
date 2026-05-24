<?php

namespace App\Http\Controllers;

use App\Models\Cut;
use App\Models\Suki;
use App\Models\SukiPayment;
use App\Models\SukiTabEntry;
use Illuminate\Http\Request;

class SukiTabController extends Controller
{
    public function storeEntry(Request $request, Suki $suki)
    {
        $request->validate([
            'date'                   => 'required|date',
            'items'                  => 'required|array|min:1',
            'items.*.cut_id'         => 'required|exists:cuts,id',
            'items.*.kilo'           => 'required|numeric|min:0',
            'items.*.price_per_kilo' => 'required|numeric|min:0',
        ]);

        // Build description and total from items
        $cutNames = Cut::whereIn('id', collect($request->items)->pluck('cut_id'))
            ->pluck('name', 'id');

        $lines = collect($request->items)->map(function ($item) use ($cutNames) {
            $total = round($item['kilo'] * $item['price_per_kilo'], 2);
            return "{$cutNames[$item['cut_id']]} {$item['kilo']}kg × ₱{$item['price_per_kilo']} = ₱{$total}";
        });

        $amount = collect($request->items)->sum(fn($i) => $i['kilo'] * $i['price_per_kilo']);

        $suki->tabEntries()->create([
            'date'        => $request->date,
            'description' => $lines->implode(', '),
            'amount'      => round($amount, 2),
        ]);

        return back()->with('success', 'Charge added.');
    }

    public function destroyEntry(SukiTabEntry $entry)
    {
        $entry->delete();

        return back()->with('success', 'Entry deleted.');
    }

    public function storePayment(Request $request, Suki $suki)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $suki->payments()->create($data);

        return back()->with('success', 'Payment recorded.');
    }

    public function destroyPayment(SukiPayment $payment)
    {
        $payment->delete();

        return back()->with('success', 'Payment deleted.');
    }
}
