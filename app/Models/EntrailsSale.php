<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EntrailsSale extends Model
{
    use SoftDeletes;

    protected $table = 'entrails_sales';

    protected $fillable = ['date', 'customer_name', 'suki_id', 'cut_id', 'kilo', 'price_per_kilo', 'total', 'payment_type'];

    protected $casts = ['date' => 'date'];

    public function suki(): BelongsTo
    {
        return $this->belongsTo(Suki::class);
    }

    public function cut(): BelongsTo
    {
        return $this->belongsTo(Cut::class);
    }
}
