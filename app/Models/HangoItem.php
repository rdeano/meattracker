<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class HangoItem extends Model
{
    use SoftDeletes;

    protected $fillable = ['hango_transaction_id', 'cut_id', 'kilo', 'price_per_kilo', 'total'];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(HangoTransaction::class, 'hango_transaction_id');
    }

    public function cut(): BelongsTo
    {
        return $this->belongsTo(Cut::class);
    }
}
