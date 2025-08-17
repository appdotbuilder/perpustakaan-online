<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Borrowing>
 */
class BorrowingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $borrowedDate = fake()->dateTimeBetween('-3 months', 'now');
        $dueDate = (clone $borrowedDate)->modify('+14 days');
        
        return [
            'user_id' => User::factory(),
            'book_id' => Book::factory(),
            'librarian_id' => User::factory()->state(['role' => 'pustakawan']),
            'borrowed_date' => $borrowedDate,
            'due_date' => $dueDate,
            'returned_date' => null,
            'status' => 'dipinjam',
            'fine_amount' => 0,
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the book has been returned.
     */
    public function returned(): static
    {
        return $this->state(function (array $attributes) {
            $returnedDate = fake()->dateTimeBetween($attributes['borrowed_date'], 'now');
            
            return [
                'returned_date' => $returnedDate,
                'status' => 'dikembalikan',
            ];
        });
    }

    /**
     * Indicate that the book is overdue.
     */
    public function overdue(): static
    {
        return $this->state(function (array $attributes) {
            $borrowedDate = fake()->dateTimeBetween('-2 months', '-1 month');
            $dueDate = (clone $borrowedDate)->modify('+14 days');
            
            return [
                'borrowed_date' => $borrowedDate,
                'due_date' => $dueDate,
                'status' => 'terlambat',
                'fine_amount' => fake()->numberBetween(5000, 50000),
            ];
        });
    }
}