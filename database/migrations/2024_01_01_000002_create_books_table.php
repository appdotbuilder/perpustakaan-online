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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('Judul buku');
            $table->string('author')->comment('Penulis buku');
            $table->string('isbn', 20)->unique()->comment('Nomor ISBN buku');
            $table->year('year_published')->comment('Tahun terbit');
            $table->string('publisher')->comment('Penerbit');
            $table->string('genre')->comment('Genre buku');
            $table->integer('total_copies')->default(1)->comment('Total jumlah kopi buku');
            $table->integer('available_copies')->default(1)->comment('Jumlah kopi yang tersedia');
            $table->text('description')->nullable()->comment('Deskripsi buku');
            $table->string('cover_image')->nullable()->comment('Path gambar sampul');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('title');
            $table->index('author');
            $table->index('isbn');
            $table->index('genre');
            $table->index('year_published');
            $table->index(['available_copies', 'title']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};