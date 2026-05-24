<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SukiPayment extends Model
{
    use SoftDeletes;

    protected $table = 'suki_payments';

    protected $fillable = ['suki_id', 'date', 'amount', 'notes'];

    protected $casts = ['date' => 'date'];

    public function suki(): BelongsTo
    {
        return $this->belongsTo(Suki::class);
    }
}
