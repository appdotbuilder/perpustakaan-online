<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBorrowingRequest;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BorrowingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Borrowing::with(['user', 'book', 'librarian']);

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'overdue') {
                $query->overdue();
            } else {
                $query->where('status', $request->status);
            }
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->where('borrowed_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('borrowed_date', '<=', $request->date_to);
        }

        $borrowings = $query->latest('borrowed_date')->paginate(15)->withQueryString();

        // Get users for filter dropdown
        $users = User::where('role', '!=', 'administrator')
                    ->select('id', 'name')
                    ->orderBy('name')
                    ->get();

        return Inertia::render('borrowings/index', [
            'borrowings' => $borrowings,
            'users' => $users,
            'filters' => $request->only(['status', 'user_id', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $books = Book::available()
                    ->select('id', 'title', 'author', 'available_copies')
                    ->orderBy('title')
                    ->get();

        $users = User::where('role', '!=', 'administrator')
                    ->where('is_active', true)
                    ->select('id', 'name', 'email')
                    ->orderBy('name')
                    ->get();

        return Inertia::render('borrowings/create', [
            'books' => $books,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBorrowingRequest $request)
    {
        $book = Book::findOrFail($request->book_id);
        
        // Check if book is available
        if (!$book->isAvailable()) {
            return redirect()->back()
                ->with('error', 'Buku tidak tersedia untuk dipinjam.')
                ->withInput();
        }

        $borrowing = Borrowing::create(array_merge(
            $request->validated(),
            ['librarian_id' => auth()->id()]
        ));

        // Update book availability
        $book->borrowCopy();

        return redirect()->route('borrowings.show', $borrowing)
            ->with('success', 'Peminjaman berhasil dicatat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Borrowing $borrowing)
    {
        $borrowing->load(['user', 'book', 'librarian']);
        
        return Inertia::render('borrowings/show', [
            'borrowing' => $borrowing,
        ]);
    }

    /**
     * Return a borrowed book.
     */
    public function update(Request $request, Borrowing $borrowing)
    {
        $request->validate([
            'action' => 'required|in:return',
            'fine_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($request->action === 'return' && $borrowing->status === 'dipinjam') {
            // Calculate fine if overdue
            $fineAmount = $borrowing->isOverdue() 
                ? $borrowing->calculateFine() 
                : 0;

            $borrowing->update([
                'status' => 'dikembalikan',
                'returned_date' => now()->toDateString(),
                'fine_amount' => $request->fine_amount ?? $fineAmount,
                'notes' => $request->notes,
            ]);

            // Update book availability
            $borrowing->book->returnCopy();

            return redirect()->back()
                ->with('success', 'Buku berhasil dikembalikan.');
        }

        return redirect()->back()
            ->with('error', 'Tindakan tidak valid.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Borrowing $borrowing)
    {
        // Only allow deletion of returned books by administrators
        if (!auth()->user()->isAdministrator()) {
            abort(403);
        }

        if ($borrowing->status === 'dipinjam') {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus peminjaman yang masih aktif.');
        }

        $borrowing->delete();

        return redirect()->route('borrowings.index')
            ->with('success', 'Data peminjaman berhasil dihapus.');
    }
}