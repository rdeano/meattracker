<?php

namespace App\Services;

use App\Models\Suki;
use App\Models\SukiPayment;
use App\Models\SukiTabEntry;

class SukiLedgerService
{
    public function getLedger(Suki $suki): array
    {
        $entries = SukiTabEntry::where('suki_id', $suki->id)
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($e) => [
                'id' => $e->id,
                'type' => 'charge',
                'date' => $e->date->format('Y-m-d'),
                'description' => $e->description,
                'amount' => (float) $e->amount,
            ]);

        $payments = SukiPayment::where('suki_id', $suki->id)
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'type' => 'payment',
                'date' => $p->date->format('Y-m-d'),
                'description' => 'Payment' . ($p->notes ? " ({$p->notes})" : ''),
                'amount' => (float) $p->amount,
            ]);

        $totalCharges  = SukiTabEntry::where('suki_id', $suki->id)->sum('amount');
        $totalPayments = SukiPayment::where('suki_id', $suki->id)->sum('amount');
        $balance       = (float) $totalCharges - (float) $totalPayments;

        // Sort oldest → newest to compute running balance, then reverse for display
        $allRows = $entries->concat($payments)
            ->sortBy([['date', 'asc'], ['id', 'asc']])
            ->values();

        $running = 0.0;
        $allRows = $allRows->map(function ($row) use (&$running) {
            $running += $row['type'] === 'charge' ? $row['amount'] : -$row['amount'];
            return array_merge($row, ['running_balance' => round($running, 2)]);
        })->sortByDesc('date')->values();

        return [
            'suki'           => ['id' => $suki->id, 'name' => $suki->name, 'contact' => $suki->contact],
            'rows'           => $allRows,
            'balance'        => round($balance, 2),
            'total_charges'  => round((float) $totalCharges, 2),
            'total_payments' => round((float) $totalPayments, 2),
        ];
    }
}
