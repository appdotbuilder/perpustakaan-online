import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    year_published: number;
    publisher: string;
    genre: string;
    total_copies: number;
    available_copies: number;
    description?: string;
    created_at: string;
}

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface PaginatedBooks {
    data: Book[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Filters {
    search?: string;
    availability?: string;
    genre?: string;
    year?: string;
}

interface Props {
    books: PaginatedBooks;
    genres: string[];
    filters: Filters;
    [key: string]: unknown;
}

export default function BooksIndex({ books, genres, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedAvailability, setSelectedAvailability] = useState(filters.availability || '');
    const [selectedGenre, setSelectedGenre] = useState(filters.genre || '');
    const [selectedYear, setSelectedYear] = useState(filters.year || '');

    const handleSearch = () => {
        router.get(route('books.index'), {
            search: searchTerm || undefined,
            availability: selectedAvailability || undefined,
            genre: selectedGenre || undefined,
            year: selectedYear || undefined,
        }, {
            preserveState: true,
        });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedAvailability('');
        setSelectedGenre('');
        setSelectedYear('');
        router.get(route('books.index'));
    };

    const getAvailabilityBadge = (availableCopies: number, totalCopies: number) => {
        if (availableCopies === 0) {
            return (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    Tidak Tersedia
                </span>
            );
        } else if (availableCopies <= Math.floor(totalCopies * 0.2)) {
            return (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Stok Terbatas
                </span>
            );
        } else {
            return (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Tersedia
                </span>
            );
        }
    };

    return (
        <AppShell>
            <Head title="Katalog Buku - Sistem Perpustakaan" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            📚 Katalog Buku
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Temukan dan kelola koleksi buku perpustakaan
                        </p>
                    </div>
                    <Link
                        href={route('books.create')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        + Tambah Buku
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Pencarian
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari berdasarkan judul, penulis, atau ISBN..."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ketersediaan
                            </label>
                            <select
                                value={selectedAvailability}
                                onChange={(e) => setSelectedAvailability(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Semua</option>
                                <option value="available">Tersedia</option>
                                <option value="unavailable">Tidak Tersedia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Genre
                            </label>
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Semua Genre</option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleSearch}
                                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                🔍 Cari
                            </button>
                            <button
                                onClick={handleReset}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Menampilkan {books.data.length} dari {books.total} buku
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Halaman {books.current_page} dari {books.last_page}
                    </div>
                </div>

                {/* Books Grid */}
                {books.data.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {books.data.map((book) => (
                            <div key={book.id} className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
                                <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <span className="text-4xl">📖</span>
                                </div>
                                
                                <div className="mb-4 flex-1">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {book.title}
                                    </h3>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                        👤 {book.author}
                                    </p>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                        🏢 {book.publisher} ({book.year_published})
                                    </p>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                                        📚 {book.genre}
                                    </p>
                                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                        📋 ISBN: {book.isbn}
                                    </p>
                                    
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {book.available_copies}/{book.total_copies} tersedia
                                        </span>
                                        {getAvailabilityBadge(book.available_copies, book.total_copies)}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={route('books.show', book.id)}
                                        className="flex-1 rounded-lg bg-blue-100 px-3 py-2 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                    >
                                        Detail
                                    </Link>
                                    <Link
                                        href={route('books.edit', book.id)}
                                        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        ✏️
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl bg-white p-12 text-center shadow-lg dark:bg-gray-800">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Tidak ada buku ditemukan
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Coba ubah kriteria pencarian Anda atau tambah buku baru.
                        </p>
                        <Link
                            href={route('books.create')}
                            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            + Tambah Buku Pertama
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {books.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center gap-1">
                            {books.links.map((link, index) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={index}
                                            className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                }

                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </AppShell>
    );
}