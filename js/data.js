/**
 * Portfolio Data Configuration for Khairul Raihan Hidayat
 * Data Science & Analytics Specialist
 */

const portfolioData = {
    personal: {
        name: "Khairul Raihan Hidayat",
        nickname: "Raihan",
        role: "Data Science & BI Analyst",
        tagline: "Translating Complex Data into Strategic Business Decisions",
        bio: "Fresh Graduate Sistem Informasi (Peminatan Data Science) dari Universitas Budi Luhur dengan IPK 3.88/4.00. Berpengalaman dalam pemodelan Machine Learning (NLP, Klasifikasi, Clustering), ekstraksi data (Web Scraping & SQL), serta perancangan dasbor Business Intelligence interaktif (Tableau & Looker Studio).",
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

    stats: [
        { label: "Indeks Prestasi Kumulatif (IPK)", value: "3.88", suffix: "/4.00", icon: "academic" },
        { label: "Data Records Dianalisis", value: "780", suffix: "K+", icon: "database" },
        { label: "Akurasi Model Machine Learning", value: "92", suffix: "%", icon: "chart" },
        { label: "Proyek & Visualisasi Data", value: "10", suffix: "+", icon: "folder" }
    ],

    skills: [
        {
            category: "Programming & Databases",
            description: "Bahasa pemrograman dan kueri basis data untuk pembersihan data, eksplorasi, dan rekayasa fitur.",
            items: [
                { name: "Python", level: 92, icon: "python", tags: ["Pandas", "NumPy", "Scikit-Learn", "NLTK", "Matplotlib", "Seaborn"] },
                { name: "SQL", level: 88, icon: "sql", tags: ["MySQL", "PostgreSQL", "Data Aggregation", "Subqueries", "Joins"] },
                { name: "R Language", level: 75, icon: "r", tags: ["Data Science Fundamental", "Statistical Analysis"] }
            ]
        },
        {
            category: "Data Science & Machine Learning",
            description: "Pengembangan model prediktif, klasifikasi teks, pemrosesan bahasa alami (NLP), dan clustering.",
            items: [
                { name: "Natural Language Processing (NLP)", level: 90, icon: "nlp", tags: ["Text Cleaning", "Tokenization", "InSet Lexicon", "TF-IDF / CountVec"] },
                { name: "Classification Models", level: 88, icon: "brain", tags: ["Support Vector Machine (SVM)", "Naive Bayes", "KNN"] },
                { name: "Clustering & Modeling", level: 82, icon: "network", tags: ["K-Means", "Predictive Analytics", "Data Modeling"] }
            ]
        },
        {
            category: "BI & Data Visualization",
            description: "Perancangan dasbor interaktif, visualisasi analitis, dan storytelling berbasis data untuk bisnis.",
            items: [
                { name: "Tableau", level: 90, icon: "tableau", tags: ["Interactive Dashboards", "Calculated Fields", "Trend & Seasonal Analysis"] },
                { name: "Looker Studio", level: 85, icon: "looker", tags: ["Business Reporting", "KPI Tracking", "Executive Dashboards"] },
                { name: "Excel Advanced", level: 88, icon: "excel", tags: ["Pivot Tables", "VLOOKUP/XLOOKUP", "Data Cleansing"] }
            ]
        },
        {
            category: "Tools & Development",
            description: "Alat bantu kerja, lingkungan pengembangan, kontrol versi, dan desain antarmuka.",
            items: [
                { name: "Development Tools", level: 90, icon: "terminal", tags: ["VS Code", "Jupyter Notebook", "Streamlit", "Git & GitHub"] },
                { name: "Data Tools & UI/UX", level: 85, icon: "palette", tags: ["RapidMiner", "Figma", "Canva", "CapCut"] }
            ]
        }
    ],

    projects: [
        {
            id: "youtube-nlp-sentiment",
            title: "Pemodelan Analisis Sentimen Respons Netizen YouTube",
            subtitle: "Tugas Akhir / Skripsi (Machine Learning & NLP)",
            category: "nlp",
            categoryName: "Machine Learning & NLP",
            featured: true,
            badge: "Skripsi / Tugas Akhir",
            image: "assets/images/project-nlp.jpg",
            overview: "Aplikasi dan riset end-to-end pemodelan Machine Learning untuk klasifikasi sentimen publik pada komentar YouTube berbahasa Indonesia menggunakan komparasi algoritma Support Vector Machine (SVM) dan Naive Bayes.",
            highlights: [
                "Ekstraksi ribuan data komentar secara real-time via YouTube Data API v3",
                "Pipeline NLP lengkap: normalisasi kata slang (kamus baku lokal), stemming/tokenization, stopword removal, dan InSet Lexicon",
                "Komparasi algoritma SVM vs Naive Bayes dengan akurasi model mencapai 92.4%",
                "Integrasi Web App interaktif berbasis Streamlit dengan visualisasi WordCloud & Confusion Matrix"
            ],
            techStack: ["Python", "Streamlit", "Scikit-Learn", "NLTK", "YouTube Data API", "Pandas", "Matplotlib", "Seaborn"],
            metrics: [
                { label: "Akurasi SVM", val: "92.4%" },
                { label: "Dataset Komentar", val: "12,500+" },
                { label: "Akurasi Naive Bayes", val: "91.6%" }
            ],
            details: {
                problem: "Komentar netizen pada platform video seperti YouTube memiliki volume masif dan struktur bahasa tidak baku (slang, singkatan), sehingga sulit dianalisis secara manual untuk mengukur persepsi publik terhadap konten edukasi dan informasi.",
                solution: "Membangun sistem klasifikasi teks berbasis Python dengan normalisasi kamus kata baku, ekstraksi leksikon sentimen (InSet), serta melatih model SVM dan Multinomial Naive Bayes. Hasil dikemas dalam aplikasi Streamlit interaktif yang menyajikan WordCloud, matriks evaluasi, dan distribusi sentimen.",
                impact: "Membantu content creator dan analis media mengidentifikasi respon netizen secara presisi dalam hitungan detik dengan tingkat akurasi di atas 92%."
            },
            links: {
                github: "https://github.com/KhairulRaihan",
                demo: "#demo-analyzer"
            }
        },
        {
            id: "amazon-sales-analytics",
            title: "Amazon Sales Performance & Seasonal BI Dashboard",
            subtitle: "Business Intelligence & Revenue Analytics",
            category: "bi",
            categoryName: "Business Intelligence",
            featured: true,
            badge: "BI Dashboard",
            image: "assets/images/project-tableau.jpg",
            overview: "Eksplorasi dan visualisasi dataset penjualan historis Amazon dengan merancang dasbor eksekutif Tableau yang komprehensif untuk menganalisis tren omzet musiman dan segmentasi konsumen.",
            highlights: [
                "Analisis lebih dari 780.000+ catatan transaksi historis penjualan",
                "Identifikasi pola penjualan musiman (peak season) dan fluktuasi bulanan",
                "Visualisasi persebaran geografis pembeli (Geographic Heatmap) dan performa kategori produk",
                "Formulasi rekomendasi strategis untuk optimasi promosi dan manajemen inventaris"
            ],
            techStack: ["Tableau", "Python", "Data Cleansing", "Business Analytics", "Excel"],
            metrics: [
                { label: "Total Transaksi", val: "785K+" },
                { label: "Kategori Produk", val: "12+" },
                { label: "Revenue Scope", val: "$34M+" }
            ],
            details: {
                problem: "Manajemen bisnis membutuhkan pemahaman mendalam terkait faktor musiman, kategori produk terlaris, dan distribusi pelanggan guna merancang kampanye promosi yang efektif.",
                solution: "Mengembangkan interactive executive dashboard di Tableau dengan dynamic filters (wilayah, tanggal, kategori). Dasbor menyajikan visualisasi KPI utama, donut chart kategori barang, dan grafik tren bulanan.",
                impact: "Memberikan transparansi performa bisnis dan mengidentifikasi lonjakan transaksi pada Q3 sehingga alokasi stok dan strategi diskon dapat dioptimalkan."
            },
            links: {
                github: "https://github.com/KhairulRaihan",
                demo: null
            }
        },
        {
            id: "football-market-value",
            title: "European Football Market Value Analytics",
            subtitle: "Web Scraping & Predictive Factor Analysis",
            category: "analytics",
            categoryName: "Data Analytics & Scraping",
            featured: true,
            badge: "Predictive Analytics",
            image: "assets/images/project-football.jpg",
            overview: "Studi analitis faktor-faktor kunci yang memengaruhi valuasi pasar pemain sepak bola profesional di 3 liga teratas Eropa melalui web scraping dan integrasi dataset Kaggle.",
            highlights: [
                "Pengambilan data pemain dan statistik performa (gol, assist, usia, liga) via Web Scraping dengan Python",
                "Pembersihan data (Data Cleaning) dan imputation data kosong secara sistematis",
                "Analisis korelasi dan regresi multivariabel untuk mengevaluasi pengaruh usia vs performa",
                "Visualisasi radar chart perbandingan pemain bintang dan kurva estimasi nilai pasar"
            ],
            techStack: ["Python", "Pandas", "Scikit-Learn", "BeautifulSoup", "Seaborn", "Kaggle Dataset"],
            metrics: [
                { label: "R² Korelasi", val: "0.78" },
                { label: "Liga Dianalisis", val: "Top 3 Eropa" },
                { label: "Pemain Terdata", val: "1,200+" }
            ],
            details: {
                problem: "Valuasi pasar atlet sering kali dipengaruhi berbagai faktor yang kompleks, mulai dari usia biologis, menit bermain, hingga kontribusi ofensif (gol & assist).",
                solution: "Menggabungkan web scraping dan data mining untuk membangun dataset terpadu, lalu menerapkan analisis statistik dan pemodelan regresi guna memetakan kurva nilai puncak pemain.",
                impact: "Menghasilkan wawasan kuantitatif mengenai titik optimal usia atlet (peak performance age 24-28 tahun) dan dampaknya terhadap nilai transfer pasar."
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
            gpa: "3.88 / 4.00 (Dengan Pujian / Magna Cum Laude)",
            description: "Fokus studi pada analisis data berskala besar, pemodelan statistik, kecerdasan buatan, dan arsitektur basis data relasional.",
            courses: [
                "Analisis Big Data",
                "Pemodelan Data & Machine Learning",
                "Rekayasa Data (Data Engineering)",
                "Visualisasi Data & Business Intelligence",
                "Manajemen Basis Data Relasional (RDBMS)"
            ]
        }
    ],

    certifications: [
        {
            title: "Algorithm Certification",
            issuer: "Universitas Budi Luhur",
            date: "April 2024",
            badgeColor: "cyan",
            icon: "award",
            description: "Sertifikasi komprehensif dalam penguasaan logika pemrograman, efisiensi algoritma, dan struktur data."
        },
        {
            title: "Introduction to Data Analytics",
            issuer: "RevoU Tech Academy",
            date: "2024",
            badgeColor: "indigo",
            icon: "chart",
            description: "Pelatihan intensif metodologi analitik data, exploratory data analysis (EDA), visualisasi, dan pemecahan masalah bisnis."
        },
        {
            title: "Python Fundamental for Data Science",
            issuer: "DQLab Academy",
            date: "Desember 2023",
            badgeColor: "emerald",
            icon: "python",
            description: "Penguasaan dasar bahasa Python, manipulasi struktur data list/dictionary, dan library inti pemrosesan data."
        },
        {
            title: "R Fundamental for Data Science",
            issuer: "DQLab Academy",
            date: "Desember 2023",
            badgeColor: "violet",
            icon: "r",
            description: "Dasar komputasi statistik, manipulasi data frame, dan pembuatan plot grafik menggunakan bahasa R."
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioData;
}
