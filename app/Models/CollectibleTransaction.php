<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CollectibleTransaction extends Model
{
    use SoftDeletes;

    protected $fillable = ['date', 'customer_name', 'suki_id', 'synced_to_suki_tab'];

    protected $casts = ['date' => 'date', 'synced_to_suki_tab' => 'boolean'];

    public function suki(): BelongsTo
    {
        return $this->belongsTo(Suki::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CollectibleItem::class);
    }
}
