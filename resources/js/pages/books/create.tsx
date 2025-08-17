import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface BookFormData {
    title: string;
    author: string;
    isbn: string;
    year_published: string;
    publisher: string;
    genre: string;
    total_copies: string;
    description: string;
    [key: string]: string;
}

export default function CreateBook() {
    const [data, setData] = useState<BookFormData>({
        title: '',
        author: '',
        isbn: '',
        year_published: new Date().getFullYear().toString(),
        publisher: '',
        genre: '',
        total_copies: '1',
        description: ''
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const genres = [
        'Fiksi', 'Non-Fiksi', 'Biografi', 'Sejarah', 'Sains', 
        'Teknologi', 'Agama', 'Filosofi', 'Psikologi', 'Pendidikan',
        'Sastra', 'Komputer', 'Ekonomi', 'Politik', 'Sosial'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('books.store'), data, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
            }
        });
    };

    return (
        <AppShell>
            <Head title="Tambah Buku - Sistem Perpustakaan" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        📚 Tambah Buku Baru
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Tambahkan buku baru ke dalam koleksi perpustakaan
                    </p>
                </div>

                {/* Form */}
                <div className="max-w-4xl">
                    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Judul Buku *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData({ ...data, title: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.title ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Masukkan judul buku..."
                                    required
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Author */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Penulis *
                                </label>
                                <input
                                    type="text"
                                    value={data.author}
                                    onChange={(e) => setData({ ...data, author: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.author ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Nama penulis..."
                                    required
                                />
                                {errors.author && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.author}
                                    </p>
                                )}
                            </div>

                            {/* ISBN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    ISBN *
                                </label>
                                <input
                                    type="text"
                                    value={data.isbn}
                                    onChange={(e) => setData({ ...data, isbn: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.isbn ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="978-xxx-xxx-xxx-x"
                                    required
                                />
                                {errors.isbn && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.isbn}
                                    </p>
                                )}
                            </div>

                            {/* Publisher */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Penerbit *
                                </label>
                                <input
                                    type="text"
                                    value={data.publisher}
                                    onChange={(e) => setData({ ...data, publisher: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.publisher ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Nama penerbit..."
                                    required
                                />
                                {errors.publisher && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.publisher}
                                    </p>
                                )}
                            </div>

                            {/* Year Published */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tahun Terbit *
                                </label>
                                <input
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    value={data.year_published}
                                    onChange={(e) => setData({ ...data, year_published: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.year_published ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    required
                                />
                                {errors.year_published && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.year_published}
                                    </p>
                                )}
                            </div>

                            {/* Genre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Genre *
                                </label>
                                <select
                                    value={data.genre}
                                    onChange={(e) => setData({ ...data, genre: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.genre ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    required
                                >
                                    <option value="">Pilih Genre...</option>
                                    {genres.map((genre) => (
                                        <option key={genre} value={genre}>
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                                {errors.genre && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.genre}
                                    </p>
                                )}
                            </div>

                            {/* Total Copies */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Jumlah Kopi *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.total_copies}
                                    onChange={(e) => setData({ ...data, total_copies: e.target.value })}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.total_copies ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    required
                                />
                                {errors.total_copies && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.total_copies}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    rows={4}
                                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                        errors.description ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Deskripsi singkat tentang buku (opsional)..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 dark:focus:ring-offset-gray-800"
                            >
                                {processing ? 'Menyimpan...' : '💾 Simpan Buku'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => router.get(route('books.index'))}
                                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
                            >
                                🚫 Batal
                            </button>
                        </div>

                        {/* Help Section */}
                        <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                                💡 Tips Input Data:
                            </h4>
                            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                                <li>• Pastikan ISBN unik dan belum terdaftar</li>
                                <li>• Gunakan format ISBN yang valid (13 digit)</li>
                                <li>• Tahun terbit tidak boleh lebih dari tahun ini</li>
                                <li>• Pilih genre yang paling sesuai dengan isi buku</li>
                                <li>• Jumlah kopi menentukan berapa banyak yang bisa dipinjam</li>
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}