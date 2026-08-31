/**
 * Portfolio Data Configuration for Khairul Raihan Hidayat
 * Data Science & Business Intelligence Specialist
 */

const portfolioData = {
    personal: {
        name: "Khairul Raihan Hidayat",
        nickname: "Raihan",
        role: "Data Science & BI Specialist",
        tagline: "Menerjemahkan Data Kompleks Menjadi Keputusan Bisnis Strategis",
        bio: "Lulusan Sarjana Komputer Sistem Informasi (Peminatan Data Science) dari Universitas Budi Luhur dengan IPK 3.88/4.00. Memiliki fokus praktis pada siklus pengolahan data end-to-end: ekstraksi data (SQL & Web Scraping), pemodelan Machine Learning (Natural Language Processing & Klasifikasi), serta perancangan dasbor Business Intelligence (Tableau & Looker Studio).",
        location: "Kota Tangerang, Banten, Indonesia",
        email: "khairulraihan617@gmail.com",
        phone: "+62 898-951-8334",
        whatsapp: "628989518334",
        gpa: "3.88 / 4.00",
        degree: "Sarjana Komputer (S.Kom) - Sistem Informasi",
        university: "Universitas Budi Luhur, Jakarta",
        graduationYear: "2022 - 2026",
        cvPath: "assets/docs/Khairul_Raihan_Hidayat_CV.docx",
        socials: {
            github: "https://github.com/KhairulRaihan",
            linkedin: "https://www.linkedin.com/in/khairul-raihan-hidayat",
            email: "mailto:khairulraihan617@gmail.com",
            whatsapp: "https://wa.me/628989518334"
        }
    },

    roles: [
        "Data Science & Analytics",
        "NLP & Machine Learning Specialist",
        "Business Intelligence (Tableau & SQL)",
        "Fresh Graduate S.Kom (IPK 3.88)"
    ],

    stats: [
        { label: "IPK Kelulusan (Magna Cum Laude)", value: "3.88", suffix: "/4.00", icon: "academic" },
        { label: "Data Records Historis Dianalisis", value: "785", suffix: "K+", icon: "database" },
        { label: "Akurasi Model NLP Skripsi", value: "92.4", suffix: "%", icon: "chart" },
        { label: "Proyek & Visualisasi Data", value: "10", suffix: "+", icon: "folder" }
    ],

    skills: [
        {
            category: "Bahasa Pemrograman & Basis Data",
            description: "Fondasi utama dalam rekayasa fitur, pembersihan data, dan query relasional.",
            items: [
                { name: "Python", status: "Utama", tags: ["Pandas", "NumPy", "Scikit-Learn", "NLTK", "Matplotlib", "Seaborn"] },
                { name: "SQL", status: "Kueri Tingkat Lanjut", tags: ["MySQL", "PostgreSQL", "Aggregations", "Joins & Subqueries"] },
                { name: "R Language", status: "Fundamental", tags: ["Statistical Analysis", "Data Mining"] }
            ]
        },
        {
            category: "Machine Learning & Natural Language Processing",
            description: "Pengembangan pipeline pemrosesan teks dan pemodelan klasifikasi terkomparasi.",
            items: [
                { name: "Natural Language Processing (NLP)", status: "Spesialisasi Skripsi", tags: ["Text Preprocessing", "InSet Lexicon", "Tokenization", "TF-IDF / CountVec"] },
                { name: "Model Klasifikasi & Prediksi", status: "Penerapan Praktis", tags: ["Support Vector Machine (SVM)", "Multinomial Naive Bayes", "KNN"] },
                { name: "Clustering & Data Modeling", status: "Eksploratif", tags: ["K-Means Clustering", "Feature Engineering"] }
            ]
        },
        {
            category: "Business Intelligence & Visualisasi Data",
            description: "Transformasi kumpulan data menjadi dasbor eksekutif dan visual storytelling.",
            items: [
                { name: "Tableau", status: "Dasbor Interaktif", tags: ["Calculated Fields", "Trend & Seasonality", "Executive KPI Tracking"] },
                { name: "Looker Studio", status: "Pelaporan Bisnis", tags: ["Interactive Reporting", "Real-time Metrics"] },
                { name: "Microsoft Excel Advanced", status: "Analisis Cepat", tags: ["Pivot Tables", "VLOOKUP/XLOOKUP", "Data Cleansing"] }
            ]
        },
        {
            category: "Tools Pengembangan & Kolaborasi",
            description: "Lingkungan kerja terpadu untuk eksperimen, deployment, dan version control.",
            items: [
                { name: "Development & Version Control", status: "Harian", tags: ["VS Code", "Jupyter Notebook", "Streamlit", "Git & GitHub"] },
                { name: "Data Science Tools & Design", status: "Pendukung", tags: ["RapidMiner", "Figma", "Canva"] }
            ]
        }
    ],

    projects: [
        {
            id: "youtube-nlp-sentiment",
            title: "Pemodelan Analisis Sentimen Respons Netizen YouTube",
            subtitle: "Tugas Akhir / Skripsi — Natural Language Processing & Streamlit",
            category: "nlp",
            categoryName: "Machine Learning & NLP",
            featured: true,
            badge: "Tugas Akhir Skripsi",
            image: "assets/images/project-nlp.jpg",
            overview: "Riset komparasi performa algoritma Support Vector Machine (SVM) dan Naive Bayes untuk mengklasifikasikan persepsi publik pada belasan ribu komentar YouTube berbahasa Indonesia.",
            highlights: [
                "Ekstraksi dataset komentar secara langsung menggunakan YouTube Data API v3",
                "Normalisasi teks komprehensif: pemetaan kata slang (kamus kata baku lokal), stopword removal, dan leksikon InSet",
                "Akurasi model klasifikasi SVM mencapai 92.4% dan Multinomial Naive Bayes sebesar 91.6%",
                "Implementasi aplikasi web interaktif berbasis Streamlit lengkap dengan WordCloud dan matriks evaluasi"
            ],
            techStack: ["Python", "Streamlit", "Scikit-Learn", "NLTK", "YouTube Data API", "Pandas", "Matplotlib", "Seaborn"],
            metrics: [
                { label: "Akurasi SVM", val: "92.4%" },
                { label: "Dataset Komentar", val: "12,500+" },
                { label: "Akurasi Naive Bayes", val: "91.6%" }
            ],
            details: {
                problem: "Bahasa ulasan netizen di media sosial sarat dengan bahasa tidak baku, singkatan, dan slang daerah, menyulitkan pengukuran sentimen publik secara manual pada skala besar.",
                solution: "Membangun pipeline NLP terpadu di Python dengan kamus normalisasi kata baku lokal, leksikon sentimen InSet, dan perbandingan model SVM vs Naive Bayes. Hasil dikemas dalam aplikasi Streamlit yang responsif.",
                impact: "Memungkinkan analis media dan kreator konten memetakan persepsi publik terhadap video edukasi dalam hitungan detik dengan tingkat keandalan di atas 92%."
            },
            links: {
                github: "https://github.com/KhairulRaihan",
                demo: "#demo"
            }
        },
        {
            id: "amazon-sales-analytics",
            title: "Analisis Kinerja Penjualan & Tren Musiman Amazon",
            subtitle: "Business Intelligence & Revenue Forecasting",
            category: "bi",
            categoryName: "Business Intelligence",
            featured: true,
            badge: "BI Dashboard",
            image: "assets/images/project-tableau.jpg",
            overview: "Eksplorasi dataset transaksi Amazon historis untuk memetakan perilaku pembelian pelanggan, pola pendapatan musiman, dan kontribusi kategori produk.",
            highlights: [
                "Pengolahan dan pembersihan dataset transaksi skala besar (780.000+ baris data)",
                "Perancangan dasbor eksekutif Tableau dengan filter dinamis berdasarkan wilayah, periode, dan lini produk",
                "Identifikasi lonjakan transaksi pada kuartal ketiga (Q3) sebagai dasar strategi alokasi inventaris",
                "Pemetaan segmentasi geografis pembeli melalui peta panas distribusi penjualan"
            ],
            techStack: ["Tableau", "Python", "Data Cleansing", "Business Analytics", "Excel"],
            metrics: [
                { label: "Total Transaksi", val: "785K+" },
                { label: "Lini Kategori", val: "12+" },
                { label: "Revenue Scope", val: "$34M+" }
            ],
            details: {
                problem: "Manajemen memerlukan visibilitas cepat terhadap fluktuasi pendapatan bulanan dan kategori produk dominan guna mengoptimalkan jadwal promosi.",
                solution: "Mengembangkan dasbor Tableau terstruktur yang menampilkan metrik pendapatan, tren bulanan, serta perbandingan pangsa pasar antarkategori produk secara visual.",
                impact: "Membantu pengambilan keputusan berbasis data dalam menentukan alokasi stok produk dan fokus kampanye promosi musiman."
            },
            links: {
                github: "https://github.com/KhairulRaihan",
                demo: null
            }
        },
        {
            id: "football-market-value",
            title: "Analisis Faktor Valuasi Pasar Pemain Sepak Bola Eropa",
            subtitle: "Web Scraping & Regresi Multivariabel",
            category: "analytics",
            categoryName: "Data Analytics & Scraping",
            featured: true,
            badge: "Predictive Analytics",
            image: "assets/images/project-football.jpg",
            overview: "Studi data kuantitatif mengenai hubungan antara metrik performa (gol, assist, usia) dengan nilai pasar transfer atlet profesional di 3 liga top Eropa.",
            highlights: [
                "Automasi ekstraksi data statistik pemain dan valuasi pasar melalui Web Scraping dengan Python",
                "Pembersihan data, penanganan nilai hilang (imputation), dan integrasi dataset Kaggle",
                "Pemodelan regresi multivariabel untuk mengevaluasi korelasi performa ofensif terhadap estimasi harga",
                "Visualisasi radar chart komparasi profil pemain kunci"
            ],
            techStack: ["Python", "Pandas", "Scikit-Learn", "BeautifulSoup", "Seaborn", "Kaggle Dataset"],
            metrics: [
                { label: "Korelasi R²", val: "0.78" },
                { label: "Cakupan Liga", val: "Top 3 Eropa" },
                { label: "Pemain Dianalisis", val: "1,200+" }
            ],
            details: {
                problem: "Valuasi pasar atlet kerap menjadi perdebatan karena dipengaruhi oleh gabungan faktor usia, performa individu, dan reputasi liga.",
                solution: "Menggabungkan teknik web scraping dan analisis regresi untuk membangun model matematis yang memetakan kurva nilai puncak pemain (peak performance curve).",
                impact: "Memberikan wawasan kuantitatif mengenai rentang usia optimal atlet (24-28 tahun) dan kontribusinya terhadap peningkatan nilai transfer."
            },
            links: {
                github: "https://github.com/KhairulRaihan",
                demo: null
            }
        }
    ],

    education: [
        {
            period: "2022 - 2026",
            institution: "Universitas Budi Luhur, Jakarta",
            degree: "Sarjana Komputer (S.Kom) - Sistem Informasi",
            concentration: "Peminatan: Data Science",
            gpa: "3.88 / 4.00 (Magna Cum Laude)",
            description: "Kurikulum terfokus pada analitik data tingkat lanjut, rekayasa data, kecerdasan buatan, dan arsitektur basis data relasional.",
            courses: [
                "Analisis Big Data",
                "Pemodelan Data & Machine Learning",
                "Rekayasa Data (Data Engineering)",
                "Visualisasi Data & Business Intelligence",
                "Manajemen Basis Data Relasional"
            ]
        }
    ],

    certifications: [
        {
            title: "Algorithm Certification",
            issuer: "Universitas Budi Luhur",
            date: "April 2024",
            badgeColor: "blue",
            icon: "award",
            description: "Penguasaan logika algoritma, kompleksitas komputasi, dan struktur data fundamental."
        },
        {
            title: "Introduction to Data Analytics",
            issuer: "RevoU Tech Academy",
            date: "2024",
            badgeColor: "emerald",
            icon: "chart",
            description: "Metodologi analisis data bisnis, exploratory data analysis (EDA), dan visualisasi data praktis."
        },
        {
            title: "Python Fundamental for Data Science",
            issuer: "DQLab Academy",
            date: "Desember 2023",
            badgeColor: "slate",
            icon: "python",
            description: "Sintaks Python dasar, manipulasi array/dataframe, dan pemrosesan data ilmiah."
        },
        {
            title: "R Fundamental for Data Science",
            issuer: "DQLab Academy",
            date: "Desember 2023",
            badgeColor: "slate",
            icon: "r",
            description: "Komputasi statistik, struktur dataframe, dan visualisasi dasar dalam bahasa R."
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioData;
}
