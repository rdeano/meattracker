<?php

namespace App\Services;

use App\Models\Cut;
use App\Models\FreezerIn;
use App\Models\FreezerOut;
use App\Models\Setting;

class FreezerStockService
{
    public function getStock(): array
    {
        $defaultPrice = (float) Setting::get('default_meat_price_per_kg', 0);

        $cuts = Cut::orderBy('type')->orderBy('name')->get();

        $stock = $cuts->map(function ($cut) use ($defaultPrice) {
            $totalIn = FreezerIn::where('cut_id', $cut->id)->sum('weight_kg');
            $totalOut = FreezerOut::where('cut_id', $cut->id)->sum('weight_kg');
            $current = (float) $totalIn - (float) $totalOut;

            return [
                'cut_id' => $cut->id,
                'cut_name' => $cut->name,
                'cut_type' => $cut->type,
                'total_in' => round((float) $totalIn, 2),
                'total_out' => round((float) $totalOut, 2),
                'current_kg' => round($current, 2),
                'peso_value' => round($current * $defaultPrice, 2),
            ];
        })->filter(fn($row) => $row['total_in'] > 0 || $row['current_kg'] != 0)->values();

        $totalKg = $stock->sum('current_kg');
        $totalValue = round($totalKg * $defaultPrice, 2);

        return [
            'stock' => $stock,
            'total_kg' => round($totalKg, 2),
            'total_value' => $totalValue,
            'default_price' => $defaultPrice,
        ];
    }
}
