<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TimbangCarabao extends Model
{
    use SoftDeletes;

    protected $table = 'timbang_carabao';

    protected $fillable = ['date', 'weight_kg', 'price_per_kg', 'total', 'notes'];

    protected $casts = ['date' => 'date'];
}
