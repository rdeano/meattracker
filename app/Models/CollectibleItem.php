<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CollectibleItem extends Model
{
    use SoftDeletes;

    protected $fillable = ['collectible_transaction_id', 'cut_id', 'kilo', 'price_per_kilo', 'total'];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(CollectibleTransaction::class, 'collectible_transaction_id');
    }

    public function cut(): BelongsTo
    {
        return $this->belongsTo(Cut::class);
    }
}
