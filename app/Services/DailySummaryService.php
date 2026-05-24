<?php

namespace App\Services;

use App\Models\CashOut;
use App\Models\CashReceived;
use App\Models\CashSalesItem;
use App\Models\CollectibleItem;
use App\Models\EntrailsSale;
use App\Models\FreezerIn;
use App\Models\FreezerOut;
use App\Models\HangoItem;
use App\Models\Setting;
use App\Models\TimbangCarabao;

class DailySummaryService
{
    public function getSummary(string $date): array
    {
        $defaultPrice = (float) Setting::get('default_meat_price_per_kg', 0);

        $timbang = TimbangCarabao::whereDate('date', $date)->sum('total');
        $cashReceived = CashReceived::whereDate('date', $date)->sum('amount');
        $hangoItems = HangoItem::whereHas('transaction', fn($q) => $q->whereDate('date', $date))->sum('total');
        $freezerOutKg = FreezerOut::whereDate('date', $date)->sum('weight_kg');
        $freezerOutValue = $freezerOutKg * $defaultPrice;

        $collectibles = CollectibleItem::whereHas('transaction', fn($q) => $q->whereDate('date', $date))->sum('total');
        $freezerInKg = FreezerIn::whereDate('date', $date)->sum('weight_kg');
        $freezerInValue = $freezerInKg * $defaultPrice;
        $cashSales = CashSalesItem::whereHas('transaction', fn($q) => $q->whereDate('date', $date))->sum('total');
        $cashOut = CashOut::whereDate('date', $date)->sum('amount');

        $capitalSide = $timbang + $cashReceived + $hangoItems + $freezerOutValue;
        $lessItems = $collectibles + $freezerInValue + $cashSales + $cashOut;
        $balance = $capitalSide - $lessItems;

        // Entrails sales are informational only — pure bonus profit noted separately,
        // not included in the main balance or net gain computation.
        $entrailsSales = EntrailsSale::whereDate('date', $date)->sum('total');

        $income = $cashSales + $collectibles;
        $costs = $timbang + $hangoItems + $cashOut;
        $netGain = $income - $costs;

        return [
            'date' => $date,
            'reconciliation' => [
                'timbang' => round($timbang, 2),
                'cash_received' => round($cashReceived, 2),
                'hango_items' => round($hangoItems, 2),
                'freezer_out_value' => round($freezerOutValue, 2),
                'capital_side' => round($capitalSide, 2),
                'collectibles' => round($collectibles, 2),
                'freezer_in_value' => round($freezerInValue, 2),
                'cash_sales' => round($cashSales, 2),
                'cash_out' => round($cashOut, 2),
                'less_total' => round($lessItems, 2),
                'balance' => round($balance, 2),
            ],
            'profit' => [
                'cash_sales' => round($cashSales, 2),
                'collectibles' => round($collectibles, 2),
                'entrails_sales' => round($entrailsSales, 2),
                'income' => round($income, 2),
                'timbang' => round($timbang, 2),
                'hango_items' => round($hangoItems, 2),
                'cash_out' => round($cashOut, 2),
                'costs' => round($costs, 2),
                'net_gain' => round($netGain, 2),
            ],
        ];
    }
}
