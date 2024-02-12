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
        // Update description column to be nullable
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert description column to be non-nullable
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('description')->nullable(false)->change();
        });
    }
};
