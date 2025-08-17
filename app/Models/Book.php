<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Book
 *
 * @property int $id
 * @property string $title
 * @property string $author
 * @property string $isbn
 * @property int $year_published
 * @property string $publisher
 * @property string $genre
 * @property int $total_copies
 * @property int $available_copies
 * @property string|null $description
 * @property string|null $cover_image
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Borrowing> $borrowings
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Book newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Book newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Book query()
 * @method static \Illuminate\Database\Eloquent\Builder|Book available()
 * @method static \Illuminate\Database\Eloquent\Builder|Book searchByTitle($title)
 * @method static \Illuminate\Database\Eloquent\Builder|Book searchByAuthor($author)
 * @method static \Illuminate\Database\Eloquent\Builder|Book searchByIsbn($isbn)
 * @method static \Illuminate\Database\Eloquent\Builder|Book searchByGenre($genre)
 * @method static \Illuminate\Database\Eloquent\Builder|Book searchByYear($year)
 * @method static \Database\Factories\BookFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Book extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'author',
        'isbn',
        'year_published',
        'publisher',
        'genre',
        'total_copies',
        'available_copies',
        'description',
        'cover_image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'year_published' => 'integer',
        'total_copies' => 'integer',
        'available_copies' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the borrowings for the book.
     */
    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class);
    }

    /**
     * Scope a query to only include available books.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAvailable($query)
    {
        return $query->where('available_copies', '>', 0);
    }

    /**
     * Scope a query to search by title.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $title
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByTitle($query, $title)
    {
        return $query->where('title', 'like', '%' . $title . '%');
    }

    /**
     * Scope a query to search by author.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $author
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByAuthor($query, $author)
    {
        return $query->where('author', 'like', '%' . $author . '%');
    }

    /**
     * Scope a query to search by ISBN.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $isbn
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByIsbn($query, $isbn)
    {
        return $query->where('isbn', 'like', '%' . $isbn . '%');
    }

    /**
     * Scope a query to search by genre.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $genre
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByGenre($query, $genre)
    {
        return $query->where('genre', 'like', '%' . $genre . '%');
    }

    /**
     * Scope a query to search by year.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $year
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByYear($query, $year)
    {
        return $query->where('year_published', $year);
    }

    /**
     * Check if the book is available for borrowing.
     *
     * @return bool
     */
    public function isAvailable(): bool
    {
        return $this->available_copies > 0;
    }

    /**
     * Decrease available copies when borrowed.
     *
     * @return void
     */
    public function borrowCopy(): void
    {
        if ($this->available_copies > 0) {
            $this->decrement('available_copies');
        }
    }

    /**
     * Increase available copies when returned.
     *
     * @return void
     */
    public function returnCopy(): void
    {
        if ($this->available_copies < $this->total_copies) {
            $this->increment('available_copies');
        }
    }
}