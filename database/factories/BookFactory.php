<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalCopies = fake()->numberBetween(1, 10);
        $borrowedCopies = fake()->numberBetween(0, $totalCopies);
        
        return [
            'title' => fake()->sentence(3),
            'author' => fake()->name(),
            'isbn' => fake()->unique()->numerify('978-#-####-####-#'),
            'year_published' => fake()->numberBetween(1990, 2024),
            'publisher' => fake()->company(),
            'genre' => fake()->randomElement([
                'Fiksi', 'Non-Fiksi', 'Biografi', 'Sejarah', 'Sains', 
                'Teknologi', 'Agama', 'Filosofi', 'Psikologi', 'Pendidikan'
            ]),
            'total_copies' => $totalCopies,
            'available_copies' => $totalCopies - $borrowedCopies,
            'description' => fake()->paragraph(3),
            'cover_image' => null,
        ];
    }

    /**
     * Indicate that the book is not available.
     */
    public function unavailable(): static
    {
        return $this->state(fn (array $attributes) => [
            'available_copies' => 0,
        ]);
    }

    /**
     * Indicate that the book has many copies.
     */
    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'total_copies' => fake()->numberBetween(20, 50),
            'available_copies' => fake()->numberBetween(15, 30),
        ]);
    }
}