<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cuts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->enum('type', ['meat', 'entrails']);
            $table->timestamps();
        });

        Schema::create('suki', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('contact', 100)->nullable();
            $table->timestamps();
        });

        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('timbang_carabao', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->decimal('weight_kg', 8, 2);
            $table->decimal('price_per_kg', 8, 2);
            $table->decimal('total', 10, 2);
            $table->string('notes', 255)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('hango_transactions', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('supplier_name', 150)->nullable();
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('hango_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hango_transaction_id')->constrained('hango_transactions')->cascadeOnDelete();
            $table->foreignId('cut_id')->constrained('cuts');
            $table->decimal('kilo', 8, 2);
            $table->decimal('price_per_kilo', 8, 2);
            $table->decimal('total', 10, 2);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('collectible_transactions', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('customer_name', 150)->nullable();
            $table->foreignId('suki_id')->nullable()->constrained('suki')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('collectible_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collectible_transaction_id')->constrained('collectible_transactions')->cascadeOnDelete();
            $table->foreignId('cut_id')->constrained('cuts');
            $table->decimal('kilo', 8, 2);
            $table->decimal('price_per_kilo', 8, 2);
            $table->decimal('total', 10, 2);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('cash_sales_transactions', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('customer_name', 150)->nullable();
            $table->foreignId('suki_id')->nullable()->constrained('suki')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('cash_sales_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_sales_transaction_id')->constrained('cash_sales_transactions')->cascadeOnDelete();
            $table->foreignId('cut_id')->constrained('cuts');
            $table->decimal('kilo', 8, 2);
            $table->decimal('price_per_kilo', 8, 2);
            $table->decimal('total', 10, 2);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('entrails_sales', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('customer_name', 150)->nullable();
            $table->foreignId('suki_id')->nullable()->constrained('suki')->nullOnDelete();
            $table->foreignId('cut_id')->constrained('cuts');
            $table->decimal('kilo', 8, 2);
            $table->decimal('price_per_kilo', 8, 2);
            $table->decimal('total', 10, 2);
            $table->enum('payment_type', ['cash', 'credit']);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('cash_received', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('name', 150)->nullable();
            $table->foreignId('suki_id')->nullable()->constrained('suki')->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('notes', 255)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('cash_out', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('name', 150);
            $table->decimal('amount', 10, 2);
            $table->string('notes', 255)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('freezer_in', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('cut_id')->constrained('cuts');
            $table->decimal('weight_kg', 8, 2);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('freezer_out', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('cut_id')->constrained('cuts');
            $table->decimal('weight_kg', 8, 2);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('suki_tab_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('suki_id')->constrained('suki')->cascadeOnDelete();
            $table->date('date');
            $table->string('description', 255);
            $table->decimal('amount', 10, 2);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('suki_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('suki_id')->constrained('suki')->cascadeOnDelete();
            $table->date('date');
            $table->decimal('amount', 10, 2);
            $table->string('notes', 255)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suki_payments');
        Schema::dropIfExists('suki_tab_entries');
        Schema::dropIfExists('freezer_out');
        Schema::dropIfExists('freezer_in');
        Schema::dropIfExists('cash_out');
        Schema::dropIfExists('cash_received');
        Schema::dropIfExists('entrails_sales');
        Schema::dropIfExists('cash_sales_items');
        Schema::dropIfExists('cash_sales_transactions');
        Schema::dropIfExists('collectible_items');
        Schema::dropIfExists('collectible_transactions');
        Schema::dropIfExists('hango_items');
        Schema::dropIfExists('hango_transactions');
        Schema::dropIfExists('timbang_carabao');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('suki');
        Schema::dropIfExists('cuts');
        Schema::dropIfExists('settings');
    }
};
