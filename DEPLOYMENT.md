# Panduan Deployment NutriVision 🚀

Dokumen ini berisi panduan langkah demi langkah untuk mendeploy aplikasi **NutriVision** ke production menggunakan **Supabase** (Database), **Hugging Face Spaces** (Model AI), dan **Vercel** (Frontend & Backend).

---

## 📋 Prasyarat & Akun yang Diperlukan
Sebelum memulai, pastikan Anda telah memiliki akun di platform berikut:
1. **GitHub** - Untuk menyimpan repositori kode dan mengintegrasikannya dengan Vercel & Hugging Face.
2. **Supabase** - Untuk database PostgreSQL managed.
3. **Hugging Face** - Untuk hosting API Model Object Detection AI.
4. **Vercel** - Untuk serverless hosting frontend React dan backend Node.js.

---

## 🛠️ Ringkasan Arsitektur Deployment
```mermaid
graph TD
    User[Client / Browser] -->|Akses UI| Frontend[Vercel Frontend - React/Vite]
    Frontend -->|Kirim Request & Image| Backend[Vercel Backend - Node.js/Express]
    Backend -->|Query Data| DB[(Supabase PostgreSQL)]
    Backend -->|Kirim Gambar untuk Deteksi| AI[Hugging Face Spaces - FastAPI & TensorFlow]
```

---

## 📂 Struktur Repositori & Branch
Pastikan Anda mendeploy dari branch khusus deployment yang telah disiapkan:
* **Branch**: `deployment-setup`
* **Folder Frontend**: `/frontend` (Vite/React)
* **Folder Backend**: `/backend` (Express/Node.js/Prisma)
* **Folder Model AI**: `/model (AI)` (FastAPI/TensorFlow)

---

## 🚀 Langkah 1: Setup Database di Supabase

1. **Buat Project Baru**:
   * Masuk ke dashboard [Supabase](https://supabase.com).
   * Klik **New Project** dan pilih organisasi Anda.
   * Masukkan nama project (misal: `NutriVision-DB`), password database, dan pilih region terdekat (misal: `Singapore (ap-southeast-1)`).
   * Tunggu hingga database selesai dibuat.

2. **Dapatkan Connection String (DATABASE_URL)**:
   * Pergi ke **Project Settings** > **Database**.
   * Cari bagian **Connection string** dan pilih tab **URI** atau **Transaction** (sangat direkomendasikan menggunakan connection pooling/Port `6543` untuk lingkungan serverless seperti Vercel).
   * Salin URL tersebut. Formatnya akan seperti:
     `postgres://postgres.[username]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
   * **Penting**: Pastikan mengganti `[password]` dengan password database asli yang Anda buat. Tambahkan parameter `&connection_limit=1` di akhir URL untuk menghemat koneksi serverless.

3. **Jalankan Migrasi Database (Prisma)**:
   * Di komputer lokal Anda (pada folder `/backend`), buat file `.env` jika belum ada dan isi variabel `DATABASE_URL` dengan connection string dari Supabase di atas.
   * Jalankan command berikut dari terminal lokal untuk menerapkan skema tabel ke database Supabase production:
     ```bash
     cd backend
     npx prisma migrate deploy
     ```
   * *Catatan*: `prisma migrate deploy` akan menerapkan migrasi yang belum terpakai tanpa menghapus data atau meminta konfirmasi interaktif.

---

## 🤖 Langkah 2: Deploy Model AI di Hugging Face Spaces

Model AI NutriVision dibuat menggunakan TensorFlow dan berjalan di atas FastAPI. Kita akan menghostingnya menggunakan **Hugging Face Spaces** dengan **Docker SDK**.

1. **Buat Space Baru di Hugging Face**:
   * Masuk ke [Hugging Face](https://huggingface.co).
   * Klik profil Anda di kanan atas -> **+ New Space**.
   * Isi nama Space (misal: `nutrivision-ai-model`).
   * Pilih SDK: **Docker**.
   * Pilih Template: **Blank** (atau custom Dockerfile).
   * Pilih Space Hardware: **CPU Basic (Free tier)** sudah cukup untuk model TensorFlow berukuran kecil ini (~35MB).
   * Atur visibilitas ke **Public** (agar API backend dapat mengaksesnya).
   * Klik **Create Space**.

2. **Upload Berkas Model AI**:
   * Hugging Face Space adalah sebuah repositori Git. Anda dapat meng-clone repositori Space tersebut secara lokal, memasukkan file dari folder `model (AI)` ke dalamnya, lalu melakukan push.
   * File yang wajib disalin ke repositori Space Hugging Face adalah:
     * `Dockerfile` (berada di root repositori Space)
     * `requirements.txt`
     * `app.py`
     * Folder `models/` beserta isinya (`food_saved_model/` dan `class_names.json`)
   * Jalankan git commit & push pada repositori Space tersebut:
     ```bash
     git add .
     git commit -m "Deploy NutriVision AI Model API"
     git push
     ```

3. **Verifikasi API Model**:
   * Setelah push, Hugging Face akan otomatis membangun (build) container Docker tersebut. Proses ini memakan waktu sekitar 2-5 menit.
   * Setelah statusnya berubah menjadi **Running**, Anda dapat mengakses URL publik Space Anda. Format URL publik Hugging Face adalah:
     `https://<username>-<space-name>.hf.space`
   * Buka URL tersebut di browser untuk verifikasi. Jika berhasil, Anda akan melihat respon JSON:
     `{"message": "NutriVision API Running"}`
   * API endpoint untuk prediksi makanan adalah POST ke `https://<username>-<space-name>.hf.space/predict`.

---

## 🔌 Langkah 3: Deploy Backend di Vercel

Backend Express.js menggunakan adapter `@vercel/node` untuk dideploy sebagai Serverless Functions di Vercel.

1. **Buat Project Baru di Vercel**:
   * Masuk ke dashboard [Vercel](https://vercel.com).
   * Klik **Add New** > **Project**.
   * Hubungkan ke repositori GitHub Anda dan klik **Import** pada proyek `NutriVision-Web`.

2. **Konfigurasi Project Backend**:
   * **Project Name**: Beri nama (misal: `nutrivision-backend`).
   * **Root Directory**: Klik **Edit** dan pilih folder `backend`.
   * **Framework Preset**: Pilih **Other**.
   * **Build & Development Settings**:
     * Build Command: `npm run vercel-build` (Vercel akan otomatis mendeteksi script ini di `package.json` dan menjalankan `prisma generate` untuk menghasilkan Prisma Client untuk environment production).
     * Output Directory: *Kosongkan (default)*.
     * Install Command: *Kosongkan (default)*.

3. **Konfigurasi Environment Variables**:
   * Buka bagian **Environment Variables** di dashboard Vercel, lalu tambahkan variabel berikut:
     * `DATABASE_URL` : *URL connection pooling Supabase Anda (Port 6543).*
     * `JWT_SECRET` : *String rahasia yang panjang untuk enkripsi token JWT.*
     * `AI_SERVICE_URL` : *URL publik Hugging Face Space Anda (misal: https://username-space-name.hf.space).*
     * `FRONTEND_URL` : *URL frontend Anda kelak di Vercel (misal: https://nutrivision-app.vercel.app).*
     * `NODE_ENV` : `production`
     * `GOOGLE_CLIENT_ID` : *Google Client ID Anda (opsional untuk Google Login).*
     * `GOOGLE_CLIENT_SECRET` : *Google Client Secret Anda (opsional untuk Google Login).*

4. **Deploy**:
   * Klik tombol **Deploy**.
   * Tunggu hingga proses build selesai. Setelah selesai, salin URL Backend dari Vercel (misal: `https://nutrivision-backend.vercel.app`).

---

## 🖥️ Langkah 4: Deploy Frontend di Vercel

Frontend React/Vite dideploy secara static ke Vercel dengan routing SPA.

1. **Buat Project Baru di Vercel**:
   * Di dashboard Vercel utama, klik **Add New** > **Project** lagi.
   * Pilih repositori GitHub `NutriVision-Web` yang sama dan klik **Import**.

2. **Konfigurasi Project Frontend**:
   * **Project Name**: Beri nama (misal: `nutrivision-app` atau `nutrivision-frontend`).
   * **Root Directory**: Klik **Edit** dan pilih folder `frontend`.
   * **Framework Preset**: Pilih **Vite**.
   * **Build & Development Settings**:
     * Build Command: `npm run build` (atau `vite build`)
     * Output Directory: `dist`
     * Install Command: *Kosongkan (default)*

3. **Konfigurasi Environment Variables**:
   * Tambahkan variabel berikut pada bagian **Environment Variables**:
     * `VITE_API_BASE_URL` : *URL Backend Vercel Anda ditambah `/api/v1` (misal: `https://nutrivision-backend.vercel.app/api/v1`).*

4. **Deploy**:
   * Klik **Deploy**.
   * Setelah selesai, frontend Anda akan online! (misal di `https://nutrivision-app.vercel.app`).
   * **Penting**: Pastikan URL frontend ini dimasukkan ke dalam variabel `FRONTEND_URL` di konfigurasi Backend Anda di Vercel (Langkah 3.3) agar CORS berjalan dengan lancar. Jika Anda mengubahnya, silakan redeploy Backend Vercel Anda.

---

## 🔍 Verifikasi & Uji Coba

1. **Koneksi Database & Login**:
   * Buka website frontend Anda di browser.
   * Coba lakukan pendaftaran akun baru (Register). Jika berhasil masuk ke database Supabase, berarti Frontend -> Backend -> Supabase terhubung dengan baik.

2. **Uji Object Detection (AI)**:
   * Masuk ke halaman deteksi makanan (Scan).
   * Upload gambar makanan (misal: apel atau lemon).
   * Tekan tombol deteksi. Jika sistem mendeteksi makanan tersebut dan menampilkan nilai gizi beserta rekomendasinya, berarti Backend -> Hugging Face Spaces terhubung sempurna!

3. **Periksa Logs**:
   * Jika ada error, Anda dapat memantau log secara real-time:
     * **Backend/Frontend**: Cek tab **Logs** pada masing-masing dashboard Vercel.
     * **Model AI**: Cek tab **Logs** di dashboard Hugging Face Space Anda.
     * **Database**: Pantau log koneksi di Supabase Dashboard.
