<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SukiTabEntry extends Model
{
    use SoftDeletes;

    protected $table = 'suki_tab_entries';

    protected $fillable = ['suki_id', 'date', 'description', 'amount'];

    protected $casts = ['date' => 'date'];

    public function suki(): BelongsTo
    {
        return $this->belongsTo(Suki::class);
    }
}
