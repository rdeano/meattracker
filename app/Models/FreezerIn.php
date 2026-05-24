<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FreezerIn extends Model
{
    use SoftDeletes;

    protected $table = 'freezer_in';

    protected $fillable = ['date', 'cut_id', 'weight_kg'];

    protected $casts = ['date' => 'date'];

    public function cut(): BelongsTo
    {
        return $this->belongsTo(Cut::class);
    }
}
