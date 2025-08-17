import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Stats {
    totalBooks: number;
    availableBooks: number;
    activeBorrowings: number;
    overdueBorrowings: number;
}

interface Book {
    id: number;
    title: string;
    author: string;
    available_copies: number;
    total_copies: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface Borrowing {
    id: number;
    borrowed_date: string;
    due_date: string;
    status: string;
    user: User;
    book: Book;
}

interface DashboardData {
    totalUsers?: number;
    totalLibrarians?: number;
    recentBooks?: Book[];
    recentUsers?: User[];
    recentBorrowings?: Borrowing[];
    overdueList?: Borrowing[];
    myBorrowings?: Borrowing[];
}

interface Props {
    stats: Stats;
    data: DashboardData;
    userRole: string;
    [key: string]: unknown;
}

export default function Dashboard({ stats, data, userRole }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            'dipinjam': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            'dikembalikan': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            'terlambat': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        };
        
        const labels = {
            'dipinjam': 'Dipinjam',
            'dikembalikan': 'Dikembalikan',
            'terlambat': 'Terlambat'
        };

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <AppShell>
            <Head title="Dashboard - Sistem Perpustakaan" />

            <div className="p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        📚 Dashboard Perpustakaan
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Selamat datang di sistem manajemen perpustakaan digital
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Buku
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {stats.totalBooks}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                                📖
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Buku Tersedia
                                </p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {stats.availableBooks}
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                                ✅
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Peminjaman Aktif
                                </p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.activeBorrowings}
                                </p>
                            </div>
                            <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
                                🔄
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Terlambat
                                </p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                                    {stats.overdueBorrowings}
                                </p>
                            </div>
                            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                                ⚠️
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Aksi Cepat
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href={route('books.index')}
                            className="flex items-center rounded-lg bg-blue-600 p-4 text-white transition-all hover:bg-blue-700"
                        >
                            <span className="mr-3 text-2xl">📚</span>
                            <span className="font-medium">Katalog Buku</span>
                        </Link>

                        {(userRole === 'administrator' || userRole === 'pustakawan') && (
                            <Link
                                href={route('borrowings.create')}
                                className="flex items-center rounded-lg bg-green-600 p-4 text-white transition-all hover:bg-green-700"
                            >
                                <span className="mr-3 text-2xl">📝</span>
                                <span className="font-medium">Catat Peminjaman</span>
                            </Link>
                        )}

                        <Link
                            href={route('borrowings.index')}
                            className="flex items-center rounded-lg bg-orange-600 p-4 text-white transition-all hover:bg-orange-700"
                        >
                            <span className="mr-3 text-2xl">📋</span>
                            <span className="font-medium">Data Peminjaman</span>
                        </Link>

                        {userRole === 'administrator' && (
                            <Link
                                href={route('users.index')}
                                className="flex items-center rounded-lg bg-purple-600 p-4 text-white transition-all hover:bg-purple-700"
                            >
                                <span className="mr-3 text-2xl">👥</span>
                                <span className="font-medium">Kelola Pengguna</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Recent Borrowings */}
                    {data.recentBorrowings && (
                        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Peminjaman Terbaru
                            </h3>
                            <div className="space-y-3">
                                {data.recentBorrowings.slice(0, 5).map((borrowing) => (
                                    <div key={borrowing.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {borrowing.book.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {borrowing.user.name} • {formatDate(borrowing.borrowed_date)}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            {getStatusBadge(borrowing.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('borrowings.index')}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                                >
                                    Lihat Semua Peminjaman →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Overdue Books */}
                    {data.overdueList && data.overdueList.length > 0 && (
                        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">
                                ⚠️ Buku Terlambat
                            </h3>
                            <div className="space-y-3">
                                {data.overdueList.map((borrowing) => (
                                    <div key={borrowing.id} className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {borrowing.book.title}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {borrowing.user.name}
                                                </p>
                                                <p className="text-xs text-red-600 dark:text-red-400">
                                                    Jatuh tempo: {formatDate(borrowing.due_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* My Borrowings for non-administrators */}
                    {data.myBorrowings && data.myBorrowings.length > 0 && (
                        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                📚 Buku Yang Saya Pinjam
                            </h3>
                            <div className="space-y-3">
                                {data.myBorrowings.map((borrowing) => (
                                    <div key={borrowing.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {borrowing.book.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Pinjam: {formatDate(borrowing.borrowed_date)}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Jatuh tempo: {formatDate(borrowing.due_date)}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            {getStatusBadge(borrowing.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Books for Administrators */}
                    {data.recentBooks && userRole === 'administrator' && (
                        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Buku Terbaru
                            </h3>
                            <div className="space-y-3">
                                {data.recentBooks.map((book) => (
                                    <div key={book.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {book.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {book.author}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {book.available_copies}/{book.total_copies}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                tersedia
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('books.create')}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                                >
                                    Tambah Buku Baru →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}