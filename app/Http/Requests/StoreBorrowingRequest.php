<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBorrowingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isLibrarian() || auth()->user()->isAdministrator();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
            'borrowed_date' => 'required|date',
            'due_date' => 'required|date|after:borrowed_date',
            'notes' => 'nullable|string',
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
            'user_id.required' => 'Pengguna harus dipilih.',
            'user_id.exists' => 'Pengguna tidak valid.',
            'book_id.required' => 'Buku harus dipilih.',
            'book_id.exists' => 'Buku tidak valid.',
            'borrowed_date.required' => 'Tanggal peminjaman harus diisi.',
            'due_date.required' => 'Tanggal jatuh tempo harus diisi.',
            'due_date.after' => 'Tanggal jatuh tempo harus setelah tanggal peminjaman.',
        ];
    }
}