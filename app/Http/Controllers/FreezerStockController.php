<?php

namespace App\Http\Controllers;

use App\Models\FreezerIn;
use App\Services\FreezerStockService;
use Inertia\Inertia;
use Inertia\Response;

class FreezerStockController extends Controller
{
    public function __construct(private FreezerStockService $service) {}

    public function index(): Response
    {
        $summary = $this->service->getStock();

        $entries = FreezerIn::with('cut')
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($r) => [
                'id'        => $r->id,
                'date'      => $r->date->format('Y-m-d'),
                'cut_name'  => $r->cut->name,
                'cut_type'  => $r->cut->type,
                'weight_kg' => (float) $r->weight_kg,
            ]);

        return Inertia::render('Freezer/Stock', array_merge($summary, [
            'entries' => $entries,
        ]));
    }
}
