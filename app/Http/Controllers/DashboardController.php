<?php

namespace App\Http\Controllers;

use App\Models\CashOut;
use App\Models\CashReceived;
use App\Models\CashSalesTransaction;
use App\Models\CollectibleTransaction;
use App\Models\Cut;
use App\Models\EntrailsSale;
use App\Models\HangoTransaction;
use App\Models\Suki;
use App\Models\Supplier;
use App\Models\TimbangCarabao;
use App\Services\DailySummaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private DailySummaryService $summaryService) {}

    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        $timbang = TimbangCarabao::whereDate('date', $date)
            ->orderBy('id', 'desc')->get()
            ->map(fn($r) => ['id' => $r->id, 'weight_kg' => $r->weight_kg, 'price_per_kg' => $r->price_per_kg, 'total' => $r->total, 'notes' => $r->notes]);

        $hango = HangoTransaction::with('items.cut')
            ->whereDate('date', $date)->orderBy('id', 'desc')->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'supplier_name' => $t->supplier_name,
                'total' => $t->items->sum('total'),
                'items' => $t->items->map(fn($i) => ['id' => $i->id, 'cut_name' => $i->cut->name, 'kilo' => $i->kilo, 'price_per_kilo' => $i->price_per_kilo, 'total' => $i->total]),
            ]);

        $collectibles = CollectibleTransaction::with('items.cut', 'suki')
            ->whereDate('date', $date)->orderBy('id', 'desc')->get()
            ->map(fn($t) => [
                'id'                  => $t->id,
                'suki_id'             => $t->suki_id,
                'customer_name'       => $t->customer_name ?? $t->suki?->name,
                'total'               => $t->items->sum('total'),
                'synced_to_suki_tab'  => (bool) $t->synced_to_suki_tab,
                'items'               => $t->items->map(fn($i) => ['id' => $i->id, 'cut_name' => $i->cut->name, 'kilo' => $i->kilo, 'price_per_kilo' => $i->price_per_kilo, 'total' => $i->total]),
            ]);

        $cashSales = CashSalesTransaction::with('items.cut', 'suki')
            ->whereDate('date', $date)->orderBy('id', 'desc')->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'customer_name' => $t->customer_name ?? $t->suki?->name,
                'total' => $t->items->sum('total'),
                'items' => $t->items->map(fn($i) => ['id' => $i->id, 'cut_name' => $i->cut->name, 'kilo' => $i->kilo, 'price_per_kilo' => $i->price_per_kilo, 'total' => $i->total]),
            ]);

        $entrails = EntrailsSale::with('cut', 'suki')
            ->whereDate('date', $date)->orderBy('id', 'desc')->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'customer_name' => $r->customer_name ?? $r->suki?->name,
                'cut_name' => $r->cut->name,
                'kilo' => $r->kilo,
                'price_per_kilo' => $r->price_per_kilo,
                'total' => $r->total,
                'payment_type' => $r->payment_type,
            ]);

        $cashReceived = CashReceived::with('suki')
            ->whereDate('date', $date)->orderBy('id', 'desc')->get()
            ->map(fn($r) => ['id' => $r->id, 'name' => $r->name ?? $r->suki?->name, 'amount' => $r->amount, 'notes' => $r->notes]);

        $cashOut = CashOut::whereDate('date', $date)
            ->orderBy('id', 'desc')->get()
            ->map(fn($r) => ['id' => $r->id, 'name' => $r->name, 'amount' => $r->amount, 'notes' => $r->notes]);

        $summary = $this->summaryService->getSummary($date);

        return Inertia::render('Dashboard', [
            'date' => $date,
            'summary' => $summary,
            'timbang' => $timbang,
            'hango' => $hango,
            'collectibles' => $collectibles,
            'cashSales' => $cashSales,
            'entrails' => $entrails,
            'cashReceived' => $cashReceived,
            'cashOut' => $cashOut,
            'cuts' => [
                'meat' => Cut::where('type', 'meat')->orderBy('name')->get(['id', 'name']),
                'entrails' => Cut::where('type', 'entrails')->orderBy('name')->get(['id', 'name']),
                'all' => Cut::orderByRaw("FIELD(type,'meat','entrails')")->orderBy('name')->get(['id', 'name']),
            ],
            'sukis' => Suki::orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
        ]);
    }
}
