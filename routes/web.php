<?php

use App\Http\Controllers\CashOutController;
use App\Http\Controllers\CashReceivedController;
use App\Http\Controllers\CashSalesController;
use App\Http\Controllers\CollectibleController;
use App\Http\Controllers\CutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EntrailsSalesController;
use App\Http\Controllers\FreezerInController;
use App\Http\Controllers\FreezerOutController;
use App\Http\Controllers\FreezerStockController;
use App\Http\Controllers\HangoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SukiController;
use App\Http\Controllers\SukiTabController;
use App\Http\Controllers\SummaryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TimbangCarabaoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Timbang carabao
    Route::get('/timbang', [TimbangCarabaoController::class, 'index'])->name('timbang.index');
    Route::post('/timbang', [TimbangCarabaoController::class, 'store'])->name('timbang.store');
    Route::put('/timbang/{timbang}', [TimbangCarabaoController::class, 'update'])->name('timbang.update');
    Route::delete('/timbang/{timbang}', [TimbangCarabaoController::class, 'destroy'])->name('timbang.destroy');

    // Hango
    Route::get('/hango', [HangoController::class, 'index'])->name('hango.index');
    Route::post('/hango', [HangoController::class, 'store'])->name('hango.store');
    Route::post('/hango/{hango}/items', [HangoController::class, 'addItems'])->name('hango.add-items');
    Route::delete('/hango/{hango}', [HangoController::class, 'destroy'])->name('hango.destroy');
    Route::delete('/hango-items/{item}', [HangoController::class, 'destroyItem'])->name('hango-items.destroy');

    // Collectibles
    Route::get('/collectibles', [CollectibleController::class, 'index'])->name('collectibles.index');
    Route::post('/collectibles', [CollectibleController::class, 'store'])->name('collectibles.store');
    Route::post('/collectibles/{collectible}/items', [CollectibleController::class, 'addItems'])->name('collectibles.add-items');
    Route::post('/collectibles/{collectible}/add-to-suki-tab', [CollectibleController::class, 'addToSukiTab'])->name('collectibles.add-to-suki-tab');
    Route::delete('/collectibles/{collectible}', [CollectibleController::class, 'destroy'])->name('collectibles.destroy');
    Route::delete('/collectible-items/{item}', [CollectibleController::class, 'destroyItem'])->name('collectible-items.destroy');

    // Cash sales
    Route::get('/cash-sales', [CashSalesController::class, 'index'])->name('cash-sales.index');
    Route::post('/cash-sales', [CashSalesController::class, 'store'])->name('cash-sales.store');
    Route::delete('/cash-sales/{cashSale}', [CashSalesController::class, 'destroy'])->name('cash-sales.destroy');
    Route::delete('/cash-sales-items/{item}', [CashSalesController::class, 'destroyItem'])->name('cash-sales-items.destroy');

    // Entrails
    Route::get('/entrails', [EntrailsSalesController::class, 'index'])->name('entrails.index');
    Route::post('/entrails', [EntrailsSalesController::class, 'store'])->name('entrails.store');
    Route::put('/entrails/{entrail}', [EntrailsSalesController::class, 'update'])->name('entrails.update');
    Route::delete('/entrails/{entrail}', [EntrailsSalesController::class, 'destroy'])->name('entrails.destroy');

    // Cash received
    Route::get('/cash-received', [CashReceivedController::class, 'index'])->name('cash-received.index');
    Route::post('/cash-received', [CashReceivedController::class, 'store'])->name('cash-received.store');
    Route::put('/cash-received/{cashReceived}', [CashReceivedController::class, 'update'])->name('cash-received.update');
    Route::delete('/cash-received/{cashReceived}', [CashReceivedController::class, 'destroy'])->name('cash-received.destroy');

    // Cash out
    Route::get('/cash-out', [CashOutController::class, 'index'])->name('cash-out.index');
    Route::post('/cash-out', [CashOutController::class, 'store'])->name('cash-out.store');
    Route::put('/cash-out/{cashOut}', [CashOutController::class, 'update'])->name('cash-out.update');
    Route::delete('/cash-out/{cashOut}', [CashOutController::class, 'destroy'])->name('cash-out.destroy');

    // Freezer
    Route::get('/freezer-in', [FreezerInController::class, 'index'])->name('freezer-in.index');
    Route::post('/freezer-in', [FreezerInController::class, 'store'])->name('freezer-in.store');
    Route::put('/freezer-in/{freezerIn}', [FreezerInController::class, 'update'])->name('freezer-in.update');
    Route::delete('/freezer-in/{freezerIn}', [FreezerInController::class, 'destroy'])->name('freezer-in.destroy');

    Route::get('/freezer-out', [FreezerOutController::class, 'index'])->name('freezer-out.index');
    Route::post('/freezer-out', [FreezerOutController::class, 'store'])->name('freezer-out.store');
    Route::put('/freezer-out/{freezerOut}', [FreezerOutController::class, 'update'])->name('freezer-out.update');
    Route::delete('/freezer-out/{freezerOut}', [FreezerOutController::class, 'destroy'])->name('freezer-out.destroy');

    Route::get('/freezer-stock', [FreezerStockController::class, 'index'])->name('freezer-stock.index');

    // Summary
    Route::get('/summary', [SummaryController::class, 'index'])->name('summary.index');

    // Suki
    Route::get('/suki', [SukiController::class, 'index'])->name('suki.index');
    Route::post('/suki', [SukiController::class, 'store'])->name('suki.store');
    Route::put('/suki/{suki}', [SukiController::class, 'update'])->name('suki.update');
    Route::delete('/suki/{suki}', [SukiController::class, 'destroy'])->name('suki.destroy');
    Route::get('/suki/{suki}/ledger', [SukiController::class, 'ledger'])->name('suki.ledger');

    // Suki tab
    Route::post('/suki/{suki}/entries', [SukiTabController::class, 'storeEntry'])->name('suki.entries.store');
    Route::delete('/suki-entries/{entry}', [SukiTabController::class, 'destroyEntry'])->name('suki.entries.destroy');
    Route::post('/suki/{suki}/payments', [SukiTabController::class, 'storePayment'])->name('suki.payments.store');
    Route::delete('/suki-payments/{payment}', [SukiTabController::class, 'destroyPayment'])->name('suki.payments.destroy');

    // Suppliers
    Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');

    // Cuts
    Route::get('/cuts', [CutController::class, 'index'])->name('cuts.index');
    Route::post('/cuts', [CutController::class, 'store'])->name('cuts.store');
    Route::put('/cuts/{cut}', [CutController::class, 'update'])->name('cuts.update');
    Route::delete('/cuts/{cut}', [CutController::class, 'destroy'])->name('cuts.destroy');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
