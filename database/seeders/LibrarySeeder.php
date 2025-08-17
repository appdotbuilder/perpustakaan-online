<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Database\Seeder;

class LibrarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create administrator
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@perpustakaan.com',
            'password' => bcrypt('password'),
            'role' => 'administrator',
            'is_active' => true,
        ]);

        // Create librarians
        $librarian1 = User::create([
            'name' => 'Sari Pustakawan',
            'email' => 'sari@perpustakaan.com',
            'password' => bcrypt('password'),
            'role' => 'pustakawan',
            'is_active' => true,
        ]);

        $librarian2 = User::create([
            'name' => 'Budi Perpustakaan',
            'email' => 'budi@perpustakaan.com',
            'password' => bcrypt('password'),
            'role' => 'pustakawan',
            'is_active' => true,
        ]);

        // Create regular users (members)
        $members = User::factory(10)->create([
            'role' => 'pustakawan', // Default role for members
            'is_active' => true,
        ]);

        // Create books with Indonesian content
        $indonesianBooks = [
            [
                'title' => 'Laskar Pelangi',
                'author' => 'Andrea Hirata',
                'isbn' => '978-979-22-3274-4',
                'year_published' => 2005,
                'publisher' => 'Bentang Pustaka',
                'genre' => 'Fiksi',
                'total_copies' => 5,
                'available_copies' => 3,
                'description' => 'Novel tentang perjuangan anak-anak Belitung dalam mengejar pendidikan.',
            ],
            [
                'title' => 'Bumi Manusia',
                'author' => 'Pramoedya Ananta Toer',
                'isbn' => '978-979-416-013-7',
                'year_published' => 1980,
                'publisher' => 'Hasta Mitra',
                'genre' => 'Sejarah',
                'total_copies' => 3,
                'available_copies' => 2,
                'description' => 'Novel sejarah tentang kehidupan di Hindia Belanda.',
            ],
            [
                'title' => 'Ayat-Ayat Cinta',
                'author' => 'Habiburrahman El Shirazy',
                'isbn' => '978-979-076-225-8',
                'year_published' => 2004,
                'publisher' => 'Republika',
                'genre' => 'Agama',
                'total_copies' => 4,
                'available_copies' => 4,
                'description' => 'Novel inspiratif tentang cinta dan spiritualitas.',
            ],
            [
                'title' => 'Ronggeng Dukuh Paruk',
                'author' => 'Ahmad Tohari',
                'isbn' => '978-979-22-1234-5',
                'year_published' => 1982,
                'publisher' => 'Gramedia',
                'genre' => 'Fiksi',
                'total_copies' => 2,
                'available_copies' => 1,
                'description' => 'Trilogi tentang kehidupan seorang ronggeng di Jawa.',
            ],
            [
                'title' => 'Negeri 5 Menara',
                'author' => 'Ahmad Fuadi',
                'isbn' => '978-979-22-5678-9',
                'year_published' => 2009,
                'publisher' => 'Gramedia',
                'genre' => 'Biografi',
                'total_copies' => 6,
                'available_copies' => 4,
                'description' => 'Kisah inspiratif tentang pendidikan pesantren.',
            ]
        ];

        foreach ($indonesianBooks as $bookData) {
            Book::create($bookData);
        }

        // Create additional random books
        Book::factory(45)->create();

        // Create some borrowings
        $books = Book::all();
        $users = User::where('role', '!=', 'administrator')->get();

        // Active borrowings
        foreach (range(1, 15) as $i) {
            $book = $books->random();
            if ($book->available_copies > 0) {
                Borrowing::factory()->create([
                    'user_id' => $users->random()->id,
                    'book_id' => $book->id,
                    'librarian_id' => collect([$librarian1->id, $librarian2->id])->random(),
                ]);
                $book->borrowCopy();
            }
        }

        // Returned borrowings
        Borrowing::factory(20)->returned()->create([
            'librarian_id' => collect([$librarian1->id, $librarian2->id])->random(),
        ]);

        // Overdue borrowings
        foreach (range(1, 5) as $i) {
            $book = $books->random();
            if ($book->available_copies > 0) {
                Borrowing::factory()->overdue()->create([
                    'user_id' => $users->random()->id,
                    'book_id' => $book->id,
                    'librarian_id' => collect([$librarian1->id, $librarian2->id])->random(),
                ]);
                $book->borrowCopy();
            }
        }
    }
}