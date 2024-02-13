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
        // Add reset_code_expiry column
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('reset_code_expiry')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop reset_code_expiry column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('reset_code_expiry');
        });
    }
};
