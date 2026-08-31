# 🚀 Website Portofolio Personal - Khairul Raihan Hidayat

Website portofolio profesional, modern, dan interaktif untuk profil **Data Science & Business Intelligence Specialist**. Dibangun menggunakan HTML5 semantik, CSS3 modern (*Glassmorphism & Cyber Luxe Aesthetics*), dan Vanilla JavaScript modular.

Website ini **100% kompatibel dan siap di-deploy langsung ke GitHub Pages** tanpa perlu langkah build (*zero build step*).

---

## 🌟 Fitur Utama

- **Desain & Estetika Premium**:
  - *Modern Dark Theme* (default) dengan aksen neon cyan & violet, serta opsi beralih ke *Clean Light Mode*.
  - Latar belakang partikel konstelasi dinamis (*HTML5 Canvas*).
  - *Glassmorphism card effects* & mikro-animasi pada setiap komponen.
  - Tipografi Google Fonts (*Outfit* & *Plus Jakarta Sans*).
- **Konten Portofolio Lengkap**:
  - **Hero Section**: Dynamic Typewriter, status ketersediaan kerja, dan floating achievement badges (IPK 3.88, 92.4% Akurasi).
  - **Pilar Pendidikan & Ringkasan**: Lulusan Universitas Budi Luhur (Sarjana Komputer - Sistem Informasi, Data Science).
  - **Matriks Keahlian (Skills)**: Python, SQL, Tableau, Looker Studio, NLP, Machine Learning, dll.
  - **Showcase Proyek Filterable**: Proyek Skripsi NLP YouTube, Dasbor Tableau Amazon Sales, dan Analisis Valuasi Sepak Bola.
  - **Modal Detail Studi Kasus**: Pop-up interaktif untuk melihat latar belakang masalah, metodologi, dan dampak bisnis.
  - **Interactive NLP Playground**: Simulator sentimen interaktif langsung di browser untuk menguji teks ulasan berbahasa Indonesia.
  - **Sertifikasi**: Kredensial dari Budi Luhur, RevoU, dan DQLab.
  - **Kontak & Download CV**: Direct WhatsApp, Salin Email instan (*Toast notification*), dan tombol unduh file resume ATS.
- **Konfigurasi Data Mudah**:
  - Seluruh data proyek, keahlian, dan sertifikasi tersimpan rapi di `js/data.js` sehingga Anda dapat menambah atau mengubah data kapan saja tanpa perlu merombak file HTML.

---

## 📁 Struktur Direktori

```
career/
├── index.html                  # Halaman utama portofolio
├── README.md                   # Dokumentasi & panduan deploy GitHub Pages
├── css/
│   ├── style.css              # Sistem desain, variabel CSS, tema dark/light, responsif
│   └── animations.css         # Keyframe animasi, efek glow, transisi scroll
├── js/
│   ├── data.js                # Data proyek, keahlian, sertifikasi (mudah diedit)
│   └── main.js                # Logika interaktif, filter, modal, tema, NLP simulator
└── assets/
    ├── docs/                  # File resume / CV
    │   └── Khairul_Raihan_Hidayat_CV.docx
    └── images/                # Foto profil dan thumbnail proyek
        ├── profile.jpg
        ├── project-nlp.jpg
        ├── project-tableau.jpg
        └── project-football.jpg
```

---

## 🌐 Cara Mempublikasikan (Deploy) ke GitHub Pages (Gratis)

Ikuti langkah-langkah mudah berikut untuk membuat website ini online dan dapat diakses publik melalui link `https://<username-github>.github.io/<nama-repo>/`:

### Langkah 1: Buat Repositori Baru di GitHub
1. Buka [github.com](https://github.com/) dan login ke akun Anda.
2. Klik tombol **New** (atau ikon `+` di kanan atas lalu pilih **New repository**).
3. Beri nama repositori, misalnya: `portfolio` atau `career` (atau `<username>.github.io` jika ingin dijadikan website utama).
4. Pilih **Public**.
5. **Jangan centang** "Add a README file" (karena kita sudah memiliki README di lokal).
6. Klik tombol **Create repository**.

---

### Langkah 2: Upload Kode dari Komputer Anda ke GitHub

Buka **Terminal** atau **Git Bash** / **PowerShell** di folder `career`, lalu jalankan perintah berikut:

```bash
# 1. Inisialisasi Git
git init

# 2. Tambahkan semua berkas ke git
git add .

# 3. Buat commit pertama
git commit -m "feat: initial commit modern data science portfolio"

# 4. Ganti branch ke main
git branch -M main

# 5. Hubungkan ke repositori GitHub Anda (Ganti <username> dan <nama-repo> sesuai akun Anda)
git remote add origin https://github.com/<username-github>/<nama-repo>.git

# 6. Push ke GitHub
git push -u origin main
```

---

### Langkah 3: Aktifkan GitHub Pages (1-Klik)

1. Di halaman repositori GitHub Anda, klik tab **Settings** (di menu bagian atas).
2. Di sidebar sebelah kiri, klik menu **Pages** (pada bagian *Code and automation*).
3. Pada bagian **Build and deployment**:
   - **Source**: Pilih `Deploy from a branch`.
   - **Branch**: Pilih `main` (atau `master`) dan folder `/ (root)`.
4. Klik tombol **Save**.
5. Tunggu sekitar 1–2 menit. Refresh halaman Settings > Pages tersebut.
6. Anda akan melihat notifikasi berwarna hijau:
   > *"Your site is live at https://<username-github>.github.io/<nama-repo>/"*

🎉 **Selamat! Website portofolio Anda sekarang sudah live dan dapat dibagikan di CV, LinkedIn, atau surat lamaran kerja!**

---

## ✏️ Cara Mengupdate Data Portofolio di Masa Depan

Jika Anda ingin menambah proyek baru, mengubah kontak, atau menambah sertifikasi:
1. Buka file `js/data.js` menggunakan text editor (VS Code, Notepad, dll).
2. Tambahkan atau ubah data pada array `projects`, `skills`, atau `certifications`.
3. Simpan file.
4. Lakukan commit dan push ke GitHub:
   ```bash
   git add .
   git commit -m "update: perbarui data portofolio"
   git push
   ```
   *GitHub Pages akan otomatis memperbarui tampilan website Anda dalam hitungan detik!*

---

&copy; 2026 **Khairul Raihan Hidayat**. All rights reserved.
