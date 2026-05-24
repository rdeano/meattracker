<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Suki extends Model
{
    protected $table = 'suki';
    protected $fillable = ['name', 'contact'];

    public function tabEntries(): HasMany
    {
        return $this->hasMany(SukiTabEntry::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SukiPayment::class);
    }
}
