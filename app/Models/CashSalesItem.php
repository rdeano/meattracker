<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CashSalesItem extends Model
{
    use SoftDeletes;

    protected $table = 'cash_sales_items';

    protected $fillable = ['cash_sales_transaction_id', 'cut_id', 'kilo', 'price_per_kilo', 'total'];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(CashSalesTransaction::class, 'cash_sales_transaction_id');
    }

    public function cut(): BelongsTo
    {
        return $this->belongsTo(Cut::class);
    }
}
