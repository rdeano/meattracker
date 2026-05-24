<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CashReceived extends Model
{
    use SoftDeletes;

    protected $table = 'cash_received';

    protected $fillable = ['date', 'name', 'suki_id', 'amount', 'notes'];

    protected $casts = ['date' => 'date'];

    public function suki(): BelongsTo
    {
        return $this->belongsTo(Suki::class);
    }
}
