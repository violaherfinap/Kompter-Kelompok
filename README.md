# Sistem Informasi Akademik Universitas Gadjah Muda

Aplikasi web untuk menampilkan data akademik (mahasiswa, dosen, mata kuliah, dan perkuliahan) dari basis data SQL Server terdistribusi.

Dibuat sebagai tugas kelompok 1 mata kuliah **Komputasi Terdistribusi**.

---

## Struktur Proyek

```
project/
├── .env               # Konfigurasi environment (tidak di-commit)
├── .gitignore
├── server.js          # Entry point backend
├── config/
│   └── db.js          # Konfigurasi koneksi database
├── routes/
│   └── api.js         # Definisi endpoint REST API
└── index.html         # Frontend tampilan data
```

---

## Prasyarat

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- SQL Server (lokal atau remote via Tailscale)
- npm

---

## Instalasi

```bash
# Clone repository
git clone <url-repository>
cd <nama-folder>

# Install dependency
npm install express mssql msnodesqlv8 cors dotenv
```

---

## Konfigurasi

Buat file `.env` di root proyek berdasarkan contoh berikut:

```env
DB_SERVER=<IP atau hostname SQL Server>
DB_NAME=<nama database>
DB_USER=<username SQL Server>
DB_PASSWORD=<password>
PORT=3000
```

---

## Menjalankan Aplikasi

```bash
node server.js
```

Buka browser dan akses `http://localhost:3000`.

---

## Endpoint API

| Method | Endpoint            | Keterangan                  |
|--------|---------------------|-----------------------------|
| GET    | `/api/mahasiswa`    | Menampilkan data mahasiswa  |
| GET    | `/api/dosen`        | Menampilkan data dosen      |
| GET    | `/api/matakuliah`   | Menampilkan data mata kuliah|
| GET    | `/api/perkuliahan`  | Menampilkan data perkuliahan|

---

## Koneksi Remote via Tailscale

Untuk terhubung ke database di perangkat lain melalui jaringan Tailscale:

1. Install dan login Tailscale di kedua perangkat — [tailscale.com/download](https://tailscale.com/download)
2. Pada perangkat server: aktifkan TCP/IP di SQL Server Configuration Manager dan buka port `1433` di firewall
3. Buat SQL Server login dengan autentikasi SQL (bukan Windows Auth)
4. Isi `.env` dengan IP Tailscale server (`100.x.x.x`) beserta kredensial SQL login

---

## Teknologi

- **Backend** — Node.js, Express, mssql (tedious)
- **Frontend** — HTML, CSS, Vanilla JS
- **Database** — Microsoft SQL Server
- **Jaringan** — Tailscale (opsional, untuk koneksi remote)