import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Book {
    id: number;
    title: string;
    author: string;
    available_copies: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    books: Book[];
    users: User[];
    [key: string]: unknown;
}

interface BorrowingFormData {
    user_id: string;
    book_id: string;
    borrowed_date: string;
    due_date: string;
    notes: string;
    [key: string]: string;
}

export default function CreateBorrowing({ books, users }: Props) {
    const [data, setData] = useState<BorrowingFormData>({
        user_id: '',
        book_id: '',
        borrowed_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
        notes: ''
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('borrowings.store'), data, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
            }
        });
    };

    const selectedBook = books.find(book => book.id === parseInt(data.book_id));

    return (
        <AppShell>
            <Head title="Catat Peminjaman - Sistem Perpustakaan" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        📝 Catat Peminjaman Baru
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Catat peminjaman buku baru untuk anggota perpustakaan
                    </p>
                </div>

                {/* Form */}
                <div className="max-w-3xl">
                    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* User Selection */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Peminjam *
                                </label>
                                <select
                                    value={data.user_id}
                                    onChange={(e) => setData({ ...data, user_id: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.user_id ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    required
                                >
                                    <option value="">Pilih Peminjam...</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.user_id}
                                    </p>
                                )}
                            </div>

                            {/* Book Selection */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Buku *
                                </label>
                                <select
                                    value={data.book_id}
                                    onChange={(e) => setData({ ...data, book_id: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.book_id ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    required
                                >
                                    <option value="">Pilih Buku...</option>
                                    {books.map((book) => (
                                        <option key={book.id} value={book.id}>
                                            {book.title} - {book.author} ({book.available_copies} tersedia)
                                        </option>
                                    ))}
                                </select>
                                {errors.book_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.book_id}
                                    </p>
                                )}
                                {selectedBook && (
                                    <div className="mt-2 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                                        <div className="flex items-center">
                                            <span className="mr-2 text-blue-600 dark:text-blue-400">📖</span>
                                            <div className="text-sm">
                                                <p className="font-medium text-blue-800 dark:text-blue-300">
                                                    {selectedBook.title}
                                                </p>
                                                <p className="text-blue-600 dark:text-blue-400">
                                                    {selectedBook.author} • {selectedBook.available_copies} kopi tersedia
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Borrowed Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tanggal Peminjaman *
                                </label>
                                <input
                                    type="date"
                                    value={data.borrowed_date}
                                    onChange={(e) => setData({ ...data, borrowed_date: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.borrowed_date ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    required
                                />
                                {errors.borrowed_date && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.borrowed_date}
                                    </p>
                                )}
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tanggal Jatuh Tempo *
                                </label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData({ ...data, due_date: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.due_date ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    required
                                />
                                {errors.due_date && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.due_date}
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Catatan
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData({ ...data, notes: e.target.value })}
                                    rows={3}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.notes ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Catatan tambahan (opsional)..."
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 dark:focus:ring-offset-gray-800"
                            >
                                {processing ? 'Menyimpan...' : '💾 Simpan Peminjaman'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => router.get(route('borrowings.index'))}
                                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
                            >
                                🚫 Batal
                            </button>
                        </div>

                        {/* Quick Guide */}
                        <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                                📋 Panduan Cepat:
                            </h4>
                            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                                <li>• Pastikan peminjam adalah anggota aktif perpustakaan</li>
                                <li>• Periksa ketersediaan buku sebelum mencatat peminjaman</li>
                                <li>• Periode peminjaman standar adalah 14 hari</li>
                                <li>• Denda keterlambatan Rp 1.000 per hari</li>
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}