<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Book::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->searchByTitle($search)
                  ->orWhere(function ($subQuery) use ($search) {
                      $subQuery->searchByAuthor($search);
                  })
                  ->orWhere(function ($subQuery) use ($search) {
                      $subQuery->searchByIsbn($search);
                  })
                  ->orWhere(function ($subQuery) use ($search) {
                      $subQuery->searchByGenre($search);
                  });
            });
        }

        // Filter by availability
        if ($request->filled('availability')) {
            if ($request->availability === 'available') {
                $query->available();
            } elseif ($request->availability === 'unavailable') {
                $query->where('available_copies', 0);
            }
        }

        // Filter by genre
        if ($request->filled('genre')) {
            $query->searchByGenre($request->genre);
        }

        // Filter by year
        if ($request->filled('year')) {
            $query->searchByYear($request->year);
        }

        $books = $query->latest()->paginate(12)->withQueryString();

        // Get unique genres for filter
        $genres = Book::select('genre')
                     ->distinct()
                     ->orderBy('genre')
                     ->pluck('genre');

        return Inertia::render('books/index', [
            'books' => $books,
            'genres' => $genres,
            'filters' => $request->only(['search', 'availability', 'genre', 'year']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Only administrators can create books
        if (!auth()->user()->isAdministrator()) {
            abort(403, 'Hanya administrator yang dapat menambah buku.');
        }
        
        return Inertia::render('books/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookRequest $request)
    {
        $book = Book::create(array_merge(
            $request->validated(),
            ['available_copies' => $request->total_copies]
        ));

        return redirect()->route('books.show', $book)
            ->with('success', 'Buku berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        $book->load(['borrowings.user', 'borrowings.librarian']);
        
        return Inertia::render('books/show', [
            'book' => $book,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        // Only administrators can edit books
        if (!auth()->user()->isAdministrator()) {
            abort(403, 'Hanya administrator yang dapat mengedit buku.');
        }
        
        return Inertia::render('books/edit', [
            'book' => $book,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        // Calculate available copies based on the difference
        $currentBorrowed = $book->total_copies - $book->available_copies;
        $newAvailable = max(0, $request->total_copies - $currentBorrowed);
        
        $book->update(array_merge(
            $request->validated(),
            ['available_copies' => $newAvailable]
        ));

        return redirect()->route('books.show', $book)
            ->with('success', 'Data buku berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        // Only administrators can delete books
        if (!auth()->user()->isAdministrator()) {
            abort(403, 'Hanya administrator yang dapat menghapus buku.');
        }
        
        // Check if book has active borrowings
        if ($book->borrowings()->where('status', 'dipinjam')->exists()) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus buku yang sedang dipinjam.');
        }

        $book->delete();

        return redirect()->route('books.index')
            ->with('success', 'Buku berhasil dihapus.');
    }
}