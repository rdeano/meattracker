<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('collectible_transactions', function (Blueprint $table) {
            $table->boolean('synced_to_suki_tab')->default(false)->after('suki_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('collectible_transactions', function (Blueprint $table) {
            $table->dropColumn('synced_to_suki_tab');
        });
    }
};
