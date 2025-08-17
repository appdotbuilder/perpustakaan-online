import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Perpustakaan Digital">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 text-gray-800 lg:justify-center lg:p-8 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 dark:text-gray-100">
                <header className="mb-8 w-full max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                                📚
                            </div>
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">PerpusDigital</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center rounded-lg border border-blue-200 px-6 py-2.5 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="w-full max-w-6xl">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="mb-6 text-5xl font-bold leading-tight">
                            📚 <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sistem Perpustakaan</span>
                            <br />
                            <span className="text-gray-700 dark:text-gray-300">Modern & Digital</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
                            Kelola koleksi buku, peminjaman, dan pengembalian dengan mudah. 
                            Platform lengkap untuk perpustakaan modern dengan fitur pencarian canggih dan pelaporan real-time.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                        <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800/50 dark:backdrop-blur">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-2xl dark:bg-blue-900/30">
                                📖
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Katalog Buku Digital
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Kelola ribuan buku dengan informasi lengkap: judul, penulis, ISBN, tahun terbit, penerbit, dan genre.
                            </p>
                        </div>

                        <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800/50 dark:backdrop-blur">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-2xl dark:bg-green-900/30">
                                🔄
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Peminjaman & Pengembalian
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Sistem otomatis untuk tracking peminjaman, jatuh tempo, dan perhitungan denda keterlambatan.
                            </p>
                        </div>

                        <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800/50 dark:backdrop-blur">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100 text-2xl dark:bg-purple-900/30">
                                🔍
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Pencarian Canggih
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Cari buku berdasarkan judul, penulis, ISBN, tahun terbit, genre, dan status ketersediaan.
                            </p>
                        </div>

                        <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800/50 dark:backdrop-blur">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-100 text-2xl dark:bg-orange-900/30">
                                👥
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Manajemen Pengguna
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Dua peran pengguna: Administrator untuk mengelola sistem dan Pustakawan untuk operasional harian.
                            </p>
                        </div>

                        <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800/50 dark:backdrop-blur">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-red-100 text-2xl dark:bg-red-900/30">
                                📊
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Laporan & Analitik
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Laporan peminjaman dan ketersediaan buku dengan ekspor ke Excel atau Word.
                            </p>
                        </div>

                        <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800/50 dark:backdrop-blur">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-teal-100 text-2xl dark:bg-teal-900/30">
                                📱
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Interface Modern
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Antarmuka yang menarik dan responsif, optimized untuk desktop dan mobile dengan bahasa Indonesia.
                            </p>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white mb-16">
                        <div className="grid gap-8 md:grid-cols-4 text-center">
                            <div>
                                <div className="text-3xl font-bold">📚</div>
                                <div className="text-2xl font-bold mt-2">1000+</div>
                                <div className="text-blue-100">Koleksi Buku</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">👥</div>
                                <div className="text-2xl font-bold mt-2">500+</div>
                                <div className="text-blue-100">Anggota Aktif</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">🔄</div>
                                <div className="text-2xl font-bold mt-2">2000+</div>
                                <div className="text-blue-100">Peminjaman/bulan</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">⭐</div>
                                <div className="text-2xl font-bold mt-2">99%</div>
                                <div className="text-blue-100">Kepuasan Pengguna</div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                        <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-200">
                            Siap Mengelola Perpustakaan Digital?
                        </h2>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                            Bergabung dengan ribuan perpustakaan yang sudah menggunakan sistem kami untuk 
                            meningkatkan efisiensi dan pengalaman pengguna.
                        </p>
                        {!auth.user && (
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:bg-blue-700 hover:shadow-2xl"
                                >
                                    🚀 Mulai Sekarang
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-50 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                >
                                    📝 Masuk Akun
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="mt-20 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        Dikembangkan dengan ❤️ untuk perpustakaan modern Indonesia
                    </p>
                </footer>
            </div>
        </>
    );
}