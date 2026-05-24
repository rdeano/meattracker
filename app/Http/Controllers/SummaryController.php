<?php

namespace App\Http\Controllers;

use App\Services\DailySummaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SummaryController extends Controller
{
    public function __construct(private DailySummaryService $service) {}

    public function index(Request $request): Response
    {
        $date = $request->input('date', today()->toDateString());

        return Inertia::render('Summary/Index', $this->service->getSummary($date));
    }
}
