# MyFinTech - Aplikasi Manajemen Keuangan untuk Bisnis Manufaktur

[MyFinTech](https://myfintech.vercel.app) adalah aplikasi manajemen keuangan yang dirancang khusus untuk bisnis manufaktur di Indonesia. Aplikasi ini membantu bisnis mengelola keuangan mereka secara efisien, menyediakan alat untuk manajemen transaksi, pelacakan utang, manajemen piutang, dan pelaporan keuangan. Dengan integrasi ke **Supabase** untuk backend/database, MyFinTech menawarkan perhitungan keuangan real-time dan pengalaman pengguna yang mulus.

## Fitur

- **Daftar Akun (COA):** Kelola akun Anda dengan kode dan deskripsi unik untuk semua kategori keuangan.
- **Manajemen Transaksi:** Catat pendapatan dan pengeluaran, hubungkan dengan akun Anda, dan pantau semua aktivitas keuangan.
- **Pelacakan Utang:** Pantau utang yang belum dibayar (utang) dan piutang dengan status pembayaran dan laporan penuaan.
- **Manajemen Rekening Bank:** Kelola beberapa rekening bank dan lacak saldo, setoran, serta penarikan.
- **Perhitungan Otomatis:** Perhitungan real-time untuk saldo, arus kas, dan pajak.
- **Pelaporan Pajak:** Hasilkan laporan pajak seperti PPN, PPh 21/23/25, dan ringkasan pemotongan pajak.
- **Manajemen Pengguna:** Kelola profil pengguna dan atur akses berbasis peran (Administrator, Manajemen).
- **Laporan Keuangan:** Filter laporan harian, mingguan, dan bulanan, termasuk pendapatan, pengeluaran, dan arus kas.
- **Sistem Inventaris Terintegrasi:** Terhubung ke sistem inventaris menggunakan API Key.
- **Tampilan Kalender:** Lihat semua aktivitas keuangan dalam kalender interaktif.
- **Grafik Keuangan Visual:** Analisis kinerja keuangan dengan grafik bulanan dan tahunan **Manajemen Kata Sandi yang Aman:** Pastikan pembaruan dan mekanisme reset kata sandi yang aman.

## Teknologi yang Digunakan

- **Frontend:** Vite + React (dengan Tailwind CSS untuk styling)
- **Backend:** Supabase (PostgreSQL, Autentikasi, dan Penyimpanan)
- **Deployment:** Vercel

## Penyebaran

Anda dapat melihat versi live dari aplikasi di:  
[https://myfintech.vercel.app](https://myfintech.vercel.app)

## Instalasi

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

### 1. Kloning repositori

```bash
git clone https://github.com/yourusername/myfint.git
cd myfint
```

### 2. Instal dependensi

```bash
npm install
```

### 3. Konfigurasi variabel lingkungan

Buat file `.env` di root proyek dan tambahkan kredensial **Supabase** Anda. Anda dapat menemukannya di dashboard Supabase di bawah pengaturan proyek Anda.

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Jalankan server pengembangan

```bash
npm run dev
```

Ini akan memulai server pengembangan. Buka browser Anda dan kunjungi [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## Integrasi Supabase

Proyek ini terintegrasi dengan **Supabase**, yang menyediakan fungsi database real-time, autentikasi pengguna, dan penyimpanan file.

### Menyiapkan Supabase:

1. Buat proyek baru di [Supabase](https://supabase.io).
2. Siapkan tabel database Anda (Akun, Transaksi, dll.) sesuai dengan skema yang ditentukan dalam proyek.
3. Dapatkan **Supabase URL** dan **anon key** dari dashboard Supabase Anda.
4. Tambahkan kunci ini ke file `.env` seperti yang disebutkan pada langkah Instalasi.

## Penggunaan

- **Dashboard Admin:** Memberikan akses penuh ke semua fitur seperti menambahkan akun baru, membuat transaksi, mengelola pengguna, dan menghasilkan laporan.
- **Dashboard Manajemen:** Akses terbatas untuk melihat laporan dan memantau aktivitas keuangan.
- **Manajemen Profil Pengguna:** Pengguna dapat memperbarui profil mereka, mengatur kata sandi, dan mengelola kredensial login mereka dengan aman.

## Kontribusi

Kontribusi sangat diterima! Jika Anda ingin berkontribusi pada proyek ini, silakan ikuti langkah-langkah berikut:

1. Fork repositori ini
