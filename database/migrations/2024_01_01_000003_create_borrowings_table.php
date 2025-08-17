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
        Schema::create('borrowings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->foreignId('librarian_id')->constrained('users')->onDelete('cascade');
            $table->date('borrowed_date')->comment('Tanggal peminjaman');
            $table->date('due_date')->comment('Tanggal jatuh tempo');
            $table->date('returned_date')->nullable()->comment('Tanggal pengembalian aktual');
            $table->enum('status', ['dipinjam', 'dikembalikan', 'terlambat'])->default('dipinjam')->comment('Status peminjaman');
            $table->decimal('fine_amount', 10, 2)->default(0)->comment('Jumlah denda');
            $table->text('notes')->nullable()->comment('Catatan tambahan');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('book_id');
            $table->index('status');
            $table->index('borrowed_date');
            $table->index('due_date');
            $table->index(['status', 'due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrowings');
    }
};