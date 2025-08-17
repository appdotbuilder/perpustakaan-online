<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isAdministrator();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => [
                'required',
                'string',
                'max:20',
                Rule::unique('books', 'isbn')->ignore($this->route('book')->id),
            ],
            'year_published' => 'required|integer|min:1900|max:' . date('Y'),
            'publisher' => 'required|string|max:255',
            'genre' => 'required|string|max:100',
            'total_copies' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul buku harus diisi.',
            'author.required' => 'Penulis buku harus diisi.',
            'isbn.required' => 'ISBN harus diisi.',
            'isbn.unique' => 'ISBN sudah terdaftar untuk buku lain.',
            'year_published.required' => 'Tahun terbit harus diisi.',
            'year_published.min' => 'Tahun terbit tidak boleh kurang dari 1900.',
            'year_published.max' => 'Tahun terbit tidak boleh lebih dari tahun ini.',
            'publisher.required' => 'Penerbit harus diisi.',
            'genre.required' => 'Genre harus diisi.',
            'total_copies.required' => 'Jumlah kopi harus diisi.',
            'total_copies.min' => 'Jumlah kopi minimal 1.',
        ];
    }
}