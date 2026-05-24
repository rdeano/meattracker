<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cut extends Model
{
    protected $fillable = ['name', 'type'];

    public function hangoItems(): HasMany
    {
        return $this->hasMany(HangoItem::class);
    }

    public function collectibleItems(): HasMany
    {
        return $this->hasMany(CollectibleItem::class);
    }

    public function cashSalesItems(): HasMany
    {
        return $this->hasMany(CashSalesItem::class);
    }

    public function entrailsSales(): HasMany
    {
        return $this->hasMany(EntrailsSale::class);
    }

    public function freezerIn(): HasMany
    {
        return $this->hasMany(FreezerIn::class);
    }

    public function freezerOut(): HasMany
    {
        return $this->hasMany(FreezerOut::class);
    }
}
