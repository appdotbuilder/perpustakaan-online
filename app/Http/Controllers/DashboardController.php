<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Common statistics
        $totalBooks = Book::count();
        $availableBooks = Book::where('available_copies', '>', 0)->count();
        $activeBorrowings = Borrowing::where('status', 'dipinjam')->count();
        $overdueBorrowings = Borrowing::overdue()->count();

        // Role-specific data
        $roleSpecificData = [];

        if ($user->isAdministrator()) {
            $roleSpecificData = [
                'totalUsers' => User::where('role', '!=', 'administrator')->count(),
                'totalLibrarians' => User::librarians()->count(),
                'recentBooks' => Book::with('borrowings')
                                   ->latest()
                                   ->take(5)
                                   ->get(),
                'recentUsers' => User::where('role', '!=', 'administrator')
                                   ->latest()
                                   ->take(5)
                                   ->get(),
            ];
        }

        if ($user->isLibrarian() || $user->isAdministrator()) {
            $roleSpecificData = array_merge($roleSpecificData, [
                'recentBorrowings' => Borrowing::with(['user', 'book'])
                                               ->latest('borrowed_date')
                                               ->take(10)
                                               ->get(),
                'overdueList' => Borrowing::with(['user', 'book'])
                                        ->overdue()
                                        ->take(5)
                                        ->get(),
            ]);
        }

        // Personal borrowings for non-administrators
        if (!$user->isAdministrator()) {
            $roleSpecificData['myBorrowings'] = Borrowing::with('book')
                                                       ->where('user_id', $user->id)
                                                       ->where('status', 'dipinjam')
                                                       ->latest('borrowed_date')
                                                       ->take(5)
                                                       ->get();
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'totalBooks' => $totalBooks,
                'availableBooks' => $availableBooks,
                'activeBorrowings' => $activeBorrowings,
                'overdueBorrowings' => $overdueBorrowings,
            ],
            'data' => $roleSpecificData,
            'userRole' => $user->role,
        ]);
    }
}