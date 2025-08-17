import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Book {
    id: number;
    title: string;
    author: string;
}

interface Borrowing {
    id: number;
    borrowed_date: string;
    due_date: string;
    returned_date?: string;
    status: string;
    fine_amount: number;
    notes?: string;
    user: User;
    book: Book;
    librarian: User;
}

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface PaginatedBorrowings {
    data: Borrowing[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Filters {
    status?: string;
    user_id?: string;
    date_from?: string;
    date_to?: string;
}

interface Props {
    borrowings: PaginatedBorrowings;
    users: User[];
    filters: Filters;
    [key: string]: unknown;
}

export default function BorrowingsIndex({ borrowings, users, filters }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedUserId, setSelectedUserId] = useState(filters.user_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = () => {
        router.get(route('borrowings.index'), {
            status: selectedStatus || undefined,
            user_id: selectedUserId || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
        });
    };

    const handleReset = () => {
        setSelectedStatus('');
        setSelectedUserId('');
        setDateFrom('');
        setDateTo('');
        router.get(route('borrowings.index'));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string, dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        
        let statusText = '';
        let colorClass = '';

        switch (status) {
            case 'dipinjam':
                if (due < today) {
                    statusText = 'Terlambat';
                    colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
                } else {
                    statusText = 'Dipinjam';
                    colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
                }
                break;
            case 'dikembalikan':
                statusText = 'Dikembalikan';
                colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
                break;
            case 'terlambat':
                statusText = 'Terlambat';
                colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
                break;
            default:
                statusText = status;
                colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
                {statusText}
            </span>
        );
    };

    const handleReturn = (borrowingId: number) => {
        if (confirm('Apakah Anda yakin ingin mengembalikan buku ini?')) {
            router.put(route('borrowings.update', borrowingId), {
                action: 'return'
            }, {
                preserveScroll: true
            });
        }
    };

    return (
        <AppShell>
            <Head title="Data Peminjaman - Sistem Perpustakaan" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            📋 Data Peminjaman
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Kelola semua data peminjaman dan pengembalian buku
                        </p>
                    </div>
                    <Link
                        href={route('borrowings.create')}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                    >
                        + Catat Peminjaman
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Semua Status</option>
                                <option value="dipinjam">Dipinjam</option>
                                <option value="dikembalikan">Dikembalikan</option>
                                <option value="overdue">Terlambat</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Peminjam
                            </label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Semua Peminjam</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tanggal Dari
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tanggal Sampai
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                🔍 Filter
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
                        Menampilkan {borrowings.data.length} dari {borrowings.total} peminjaman
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Halaman {borrowings.current_page} dari {borrowings.last_page}
                    </div>
                </div>

                {/* Borrowings Table */}
                {borrowings.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Peminjam & Buku
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Denda
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {borrowings.data.map((borrowing) => (
                                        <tr key={borrowing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        👤 {borrowing.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        📧 {borrowing.user.email}
                                                    </p>
                                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                                                        📖 {borrowing.book.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        ✍️ {borrowing.book.author}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                <div>
                                                    <p>📅 Pinjam: {formatDate(borrowing.borrowed_date)}</p>
                                                    <p>⏰ Jatuh tempo: {formatDate(borrowing.due_date)}</p>
                                                    {borrowing.returned_date && (
                                                        <p>✅ Kembali: {formatDate(borrowing.returned_date)}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(borrowing.status, borrowing.due_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {borrowing.fine_amount > 0 ? (
                                                    <span className="text-red-600 dark:text-red-400 font-medium">
                                                        Rp {borrowing.fine_amount.toLocaleString('id-ID')}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route('borrowings.show', borrowing.id)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        Detail
                                                    </Link>
                                                    {borrowing.status === 'dipinjam' && (
                                                        <button
                                                            onClick={() => handleReturn(borrowing.id)}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                        >
                                                            Kembalikan
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl bg-white p-12 text-center shadow-lg dark:bg-gray-800">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Tidak ada data peminjaman
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Belum ada peminjaman yang sesuai dengan kriteria pencarian.
                        </p>
                        <Link
                            href={route('borrowings.create')}
                            className="mt-4 inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                            + Catat Peminjaman Pertama
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {borrowings.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center gap-1">
                            {borrowings.links.map((link, index) => {
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