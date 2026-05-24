<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class HangoTransaction extends Model
{
    use SoftDeletes;

    protected $fillable = ['date', 'supplier_name', 'supplier_id'];

    protected $casts = ['date' => 'date'];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(HangoItem::class);
    }
}
