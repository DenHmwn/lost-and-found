# Lost and Found

Aplikasi **Lost and Found** adalah platform berbasis web yang digunakan untuk **melaporkan barang hilang dan menemukan barang yang ditemukan**. Pengguna dapat melihat daftar barang hilang/temuan, menambahkan laporan, serta mengelola data melalui antarmuka web.

Proyek ini merupakan **monorepo** yang terdiri dari:

- **Backend API** → folder `api/`
- **Frontend Web** → folder `web/`

---

## Fitur Utama

- Melihat daftar barang hilang dan ditemukan  
- Menambahkan laporan barang hilang (User)  
- Menambahkan laporan barang ditemukan (Admin)
- Pengelolaan data melalui API  
- Tampilan website responsif  

---

## Struktur Folder
```text
/
├─ .vscode/ # Konfigurasi editor VSCode
├─ Dokumentasi/ # Dokumen pendukung project
├─ api/ # Backend API (server)
│ └─ src/ # Source code backend
├─ web/ # Frontend (client web)
│ └─ src/ # Source code frontend
└─ README.md # Dokumentasi utama project
```
---

## Teknologi yang Digunakan

### Backend (`/api`)
- Node.js
- TypeScript
- REST API
- (tambahkan sesuai implementasi: Express, Prisma, PostgreSQL, dsb.)

### Frontend (`/web`)
- React / Next.js
- TypeScript
- CSS / Tailwind / dll

---

## Cara Menjalankan Project

### Clone Repository

```bash
git clone https://github.com/DenHmwn/lost-and-found.git
cd lost-and-found
```

### Menjalankan Backend API
```bash
cd api
npm install
npm run dev
```

### Menjalankan Frontend
```bash
cd api
npm install
npm run dev
```
