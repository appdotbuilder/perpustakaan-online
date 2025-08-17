<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Borrowing
 *
 * @property int $id
 * @property int $user_id
 * @property int $book_id
 * @property int $librarian_id
 * @property \Illuminate\Support\Carbon $borrowed_date
 * @property \Illuminate\Support\Carbon $due_date
 * @property \Illuminate\Support\Carbon|null $returned_date
 * @property string $status
 * @property float $fine_amount
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Book $book
 * @property-read \App\Models\User $librarian
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Borrowing newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Borrowing newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Borrowing query()
 * @method static \Illuminate\Database\Eloquent\Builder|Borrowing borrowed()
 * @method static \Illuminate\Database\Eloquent\Builder|Borrowing returned()
 * @method static \Illuminate\Database\Eloquent\Builder|Borrowing overdue()
 * @method static \Database\Factories\BorrowingFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Borrowing extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'book_id',
        'librarian_id',
        'borrowed_date',
        'due_date',
        'returned_date',
        'status',
        'fine_amount',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'borrowed_date' => 'date',
        'due_date' => 'date',
        'returned_date' => 'date',
        'fine_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who borrowed the book.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the book that was borrowed.
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get the librarian who managed the borrowing.
     */
    public function librarian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'librarian_id');
    }

    /**
     * Scope a query to only include borrowed books.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBorrowed($query)
    {
        return $query->where('status', 'dipinjam');
    }

    /**
     * Scope a query to only include returned books.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeReturned($query)
    {
        return $query->where('status', 'dikembalikan');
    }

    /**
     * Scope a query to only include overdue books.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'terlambat')
                    ->orWhere(function ($query) {
                        $query->where('status', 'dipinjam')
                              ->where('due_date', '<', now()->toDateString());
                    });
    }

    /**
     * Check if the borrowing is overdue.
     *
     * @return bool
     */
    public function isOverdue(): bool
    {
        return $this->status === 'dipinjam' && $this->due_date->isPast();
    }

    /**
     * Calculate fine amount for overdue book.
     *
     * @param  float  $finePerDay
     * @return float
     */
    public function calculateFine(float $finePerDay = 1000): float
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        $overdueDays = now()->diffInDays($this->due_date);
        return $overdueDays * $finePerDay;
    }

    /**
     * Mark the borrowing as returned.
     *
     * @return void
     */
    public function markAsReturned(): void
    {
        $this->update([
            'status' => 'dikembalikan',
            'returned_date' => now()->toDateString(),
        ]);

        // Update book availability
        $this->book->returnCopy();
    }
}