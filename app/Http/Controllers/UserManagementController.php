<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Only administrators can access user management
        if (!auth()->user()->isAdministrator()) {
            abort(403);
        }

        $query = User::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            if ($request->role === 'administrator') {
                $query->administrators();
            } elseif ($request->role === 'pustakawan') {
                $query->librarians();
            }
        }

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $users = $query->withCount(['borrowings', 'managedBorrowings'])
                      ->latest()
                      ->paginate(15)
                      ->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403);
        }

        $user->load([
            'borrowings.book',
            'managedBorrowings.user',
            'managedBorrowings.book'
        ]);

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403);
        }

        return Inertia::render('users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());

        return redirect()->route('users.show', $user)
            ->with('success', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Toggle user active status.
     */
    public function destroy(User $user)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403);
        }

        // Don't allow deactivating the current admin
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menonaktifkan akun sendiri.');
        }

        // Check for active borrowings
        if ($user->borrowings()->where('status', 'dipinjam')->exists()) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menonaktifkan pengguna yang memiliki peminjaman aktif.');
        }

        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';
        
        return redirect()->back()
            ->with('success', "Pengguna berhasil {$status}.");
    }
}