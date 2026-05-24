<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CashOut extends Model
{
    use SoftDeletes;

    protected $table = 'cash_out';

    protected $fillable = ['date', 'name', 'amount', 'notes'];

    protected $casts = ['date' => 'date'];
}
