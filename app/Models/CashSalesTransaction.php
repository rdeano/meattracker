<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CashSalesTransaction extends Model
{
    use SoftDeletes;

    protected $table = 'cash_sales_transactions';

    protected $fillable = ['date', 'customer_name', 'suki_id'];

    protected $casts = ['date' => 'date'];

    public function suki(): BelongsTo
    {
        return $this->belongsTo(Suki::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CashSalesItem::class);
    }
}
