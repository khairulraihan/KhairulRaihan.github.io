import streamlit as st
import pandas as pd
import numpy as np
import re
import csv
import requests
from io import BytesIO
from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns
from googleapiclient.discovery import build
import nltk
from nltk.corpus import stopwords
from wordcloud import WordCloud, STOPWORDS
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.svm import SVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# --- Set Konfigurasi Halaman ---
st.set_page_config(page_title="Analisis Sentimen YouTube - Skripsi Dashboard", layout="wide", initial_sidebar_state="expanded")

# --- Download NLTK resources ---
@st.cache_resource
def download_nltk_resources():
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')

download_nltk_resources()

# --- Fungsi Load Data Lokal (Cara 2: Bundling Lokal) ---
@st.cache_data
def load_kamus_baku():
    try:
        # Membaca berkas XLSX langsung dari folder proyek lokal
        kamus_data = pd.read_excel("kamuskatabaku.xlsx")
        return dict(zip(kamus_data['tidak_baku'], kamus_data['kata_baku'])), True, "Kamus lokal berhasil dimuat."
    except Exception as e:
        # Kamus cadangan darurat (bila berkas lokal belum diletakkan di folder proyek)
        fallback_kamus = {
            'yg': 'yang', 'dgn': 'dengan', 'utk': 'untuk', 'bgt': 'banget', 
            'klo': 'kalau', 'tp': 'tapi', 'gk': 'tidak', 'ga': 'tidak', 
            'bs': 'bisa', 'skrg': 'sekarang', 'trs': 'terus', 'sm': 'sama',
            'msh': 'masih', 'dah': 'sudah', 'udah': 'sudah'
        }
        return fallback_kamus, False, f"Gagal membaca 'kamuskatabaku.xlsx' di folder lokal: {e}"

@st.cache_data
def load_inset_lexicons():
    # Leksikon cadangan darurat
    fallback_pos = {
        'bagus', 'keren', 'mantap', 'baik', 'hebat', 'setuju', 'terima kasih', 
        'edukasi', 'bantu', 'senang', 'cinta', 'suka', 'puas', 'luar biasa', 
        'lanjutkan', 'salut', 'terbaik', 'puji', 'dukung', 'positif', 'mendidik'
    }
    fallback_neg = {
        'korupsi', 'buruk', 'jelek', 'tolol', 'kecewa', 'marah', 'bodoh', 
        'benci', 'gagal', 'salah', 'rugi', 'parah', 'bohong', 'sulit', 
        'susah', 'mengecewakan', 'lambat', 'lemah', 'kasihan', 'miris'
    }
    try:
        # Membaca berkas TSV langsung dari folder proyek lokal
        pos_set = set(pd.read_csv("positive.tsv", sep="\t", header=None)[0])
        neg_set = set(pd.read_csv("negative.tsv", sep="\t", header=None)[0])
        return pos_set, neg_set, True, "Leksikon lokal berhasil dimuat."
    except Exception as e:
        return fallback_pos, fallback_neg, False, f"Gagal membaca 'positive.tsv'/'negative.tsv' di folder lokal: {e}"

# Eksekusi pemuatan data lokal
kamus_tidak_baku_dict, kamus_success, kamus_msg = load_kamus_baku()
positive_lexicon, negative_lexicon, inset_success, inset_msg = load_inset_lexicons()

# --- Inisialisasi Session State ---
if "df_raw" not in st.session_state:
    st.session_state.df_raw = None
if "df_preprocessed" not in st.session_state:
    st.session_state.df_preprocessed = None
if "df_labeled" not in st.session_state:
    st.session_state.df_labeled = None
if "df_freq_awal" not in st.session_state:
    st.session_state.df_freq_awal = None

# Menyimpan hasil training untuk semua split
if "split_results" not in st.session_state:
    st.session_state.split_results = None

# --- Fungsi Helper Crawling YouTube (Disamakan Persis dengan skripsi.py) ---
def get_video_comments_skripsi(youtube_client, video_id, max_comments):
    comments = []
    next_page_token = None
    while len(comments) < max_comments:
        try:
            response = youtube_client.commentThreads().list(
                part='snippet',
                videoId=video_id,
                maxResults=2000,
                textFormat='plainText',
                pageToken=next_page_token
            ).execute()

            for item in response.get('items', []):
                if len(comments) >= max_comments:
                    break
                comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
                author = item['snippet']['topLevelComment']['snippet']['authorDisplayName']
                like_count = item['snippet']['topLevelComment']['snippet']['likeCount']
                published_at = item['snippet']['topLevelComment']['snippet']['publishedAt']

                comments.append({
                    'author': author,
                    'comment': comment,
                    'likes': like_count,
                    'published_at': published_at
                })

            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break
        except Exception as e:
            st.error(f"Terjadi kesalahan saat mengambil komentar: {e}")
            break
    return comments[:max_comments]

def scrape_comments_from_videos_skripsi(youtube_client, video_ids, total_comments):
    all_comments = []
    comments_per_video = total_comments // len(video_ids)

    for video_id in video_ids:
        comments = get_video_comments_skripsi(youtube_client, video_id, comments_per_video)
        all_comments.extend(comments)

    if len(all_comments) < total_comments:
        extra_comments = total_comments - len(all_comments)
        extra_comments_from_first = get_video_comments_skripsi(youtube_client, video_ids[0], extra_comments)
        all_comments.extend(extra_comments_from_first[:extra_comments])

    return all_comments

# --- Fungsi Preprocessing ---
def remove_URL(text):
    if isinstance(text, str):
        return re.sub(r'https?://\S+|www\.\S+', '', text)
    return text

def remove_html(text):
    if isinstance(text, str):
        return re.sub(r'<.*?>', '', text)
    return text

def remove_emoji(text):
    if isinstance(text, str):
        emoji_pattern = re.compile("["
            u"\U0001F600-\U0001F64F"  # emoticons
            u"\U0001F300-\U0001F5FF"  # symbols & pictographs
            u"\U0001F680-\U0001F6FF"  # transport & map symbols
            u"\U0001F700-\U0001F77F"  # alchemical symbols
            u"\U0001F780-\U0001F7FF"  # Geometric Shapes Extended
            u"\U0001F800-\U0001F8FF"  # Supplemental Arrows-C
            u"\U0001FA00-\U0001FA6F"  # Chess Symbols
            u"\U0001FA70-\U0001FAFF"  # Symbols and Pictographs Extended-A
            u"\U0001F004-\U0001F0CF"  # Additional emoticons
            u"\U0001F1E0-\U0001F1FF"  # flags
                               "]+", flags=re.UNICODE)
        return emoji_pattern.sub(r'', text)
    return text

def remove_symbols(text):
    if isinstance(text, str):
        return re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

def remove_numbers(text):
    if isinstance(text, str):
        return re.sub(r'\d', '', text)
    return text

def remove_usernames(text):
    if isinstance(text, str):
        return re.sub(r'@\w+', '', text)
    return text

def case_folding(text):
    if isinstance(text, str):
        return text.lower()
    return text

def replace_taboo_words(text, kamus_tidak_baku):
    if isinstance(text, str):
        words = text.split()
        replaced_words = []
        for word in words:
            if word in kamus_tidak_baku:
                baku_word = kamus_tidak_baku[word]
                if isinstance(baku_word, str) and all(char.isalpha() for char in baku_word):
                    replaced_words.append(baku_word)
            else:
                replaced_words.append(word)
        return ' '.join(replaced_words)
    return ''

def remove_stopwords(words_list, hapus_kata_set):
    stop_words = set(stopwords.words('indonesian'))
    return [word for word in words_list if word not in stop_words and word not in hapus_kata_set]

def clean_text_column(series):
    cleaned = []
    for text in series.astype(str):
        text = re.sub(r"[\[\]\'\",]", "", text)
        cleaned.append(text.strip())
    return " ".join(cleaned)

# --- Fungsi Penentuan Sentimen ---
def determine_sentiment(text):
    if isinstance(text, str):
        words = text.split()
        positive_count = sum(1 for word in words if word in positive_lexicon)
        negative_count = sum(1 for word in words if word in negative_lexicon)
        sentiment_score = positive_count - negative_count
        sentiment = "Negatif" if sentiment_score < 0 else "Positif"
        return sentiment_score, sentiment
    return 0, "Negatif"


# ==========================================
# SIDEBAR NAVIGATION
# ==========================================
st.sidebar.title("Navigasi Dashboard Skripsi")
menu = st.sidebar.radio(
    "Pilih Tahapan Proyek:",
    ["1. Crawling Data", "2. Preprocessing Data", "3. Pelabelan Data InSet Lexicon", "4. Pemodelan & Evaluasi ML", "5. Prediksi Sentimen Teks Baru"]
)


# ==========================================
# MENU 1: CRAWLING DATA
# ==========================================
if menu == "1. Crawling Data":
    st.header("1. Crawling Data Komentar YouTube ")
    st.write("Silakan tarik data baru dari API atau muat dataset CSV lokal yang sudah ada.")

    # Pilihan Metode Penarikan Data (API vs CSV Upload)
    tab_api, tab_csv = st.tabs(["Crawling API YouTube", "Unggah Dataset CSV"])

    with tab_api:
        api_key = st.text_input("Masukkan API Key Google:", type="password", value="AIzaSyBi-W8Y2k1thfmEcaCWks9sk57CWG4hblY")
        video_id = st.text_input("ID Video YouTube:", value="h6qV29Chhoc")
        total_comments = st.number_input("Jumlah Maksimum Komentar:", min_value=10, max_value=15000, value=9269, step=100)

        if st.button("Mulai Unduh Komentar"):
            with st.spinner("Sedang menarik data komentar..."):
                try:
                    youtube = build('youtube', 'v3', developerKey=api_key)
                    comments = scrape_comments_from_videos_skripsi(youtube, [video_id], total_comments)
                    if comments:
                        st.session_state.df_raw = pd.DataFrame(comments)
                        st.success(f"Berhasil mengunduh {len(st.session_state.df_raw)} data komentar!")
                    else:
                        st.error("Gagal mengambil data. Pastikan API Key dan Video ID benar.")
                except Exception as e:
                    st.error(f"Error: {e}")

    with tab_csv:
        uploaded_file = st.file_uploader("Pilih berkas CSV dataset Anda (misalnya skripsi.csv):", type=["csv"])
        if uploaded_file is not None:
            try:
                st.session_state.df_raw = pd.read_csv(uploaded_file)
                st.success("Berkas CSV berhasil dimuat!")
            except Exception as e:
                st.error(f"Gagal membaca file CSV: {e}")

    if st.session_state.df_raw is not None:
        df_raw = st.session_state.df_raw.copy()
        
        st.subheader("Data Berhasil Dimuat (Raw Data)")
        st.dataframe(df_raw)

        # FITUR UNDUH: Tombol Download Dataset Mentah
        csv_raw_data = df_raw.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="⬇️ Unduh Dataset Mentah (CSV)",
            data=csv_raw_data,
            file_name="dataset_mentah.csv",
            mime="text/csv"
        )

        if 'published_at' in df_raw.columns:
            df_raw['published_at'] = pd.to_datetime(df_raw['published_at'])
            df_raw['date'] = df_raw['published_at'].dt.date
            df_raw['time'] = df_raw['published_at'].dt.time
            st.session_state.df_raw = df_raw
            
            st.subheader("Pemisahan Tanggal & Waktu (Published At)")
            st.dataframe(df_raw[['author', 'comment', 'likes', 'date', 'time']].head())
        
        st.subheader("Statistik Deskriptif Dataset (data.describe())")
        st.write(df_raw.describe())


# ==========================================
# MENU 2: PREPROCESSING DATA
# ==========================================
elif menu == "2. Preprocessing Data":
    st.header("2. Text Preprocessing Data")

    if st.session_state.df_raw is None:
        st.warning("Silakan muat data terlebih dahulu di Menu '1. Crawling Data'.")
    else:
        df_raw_prep = st.session_state.df_raw.copy()
        
        col_dup1, col_dup2 = st.columns(2)
        with col_dup1:
            st.write("**Deteksi Baris Duplikat Sebelum Drop:**")
            dup_data = df_raw_prep[df_raw_prep.duplicated(subset="comment", keep=False)]
            st.write(f"Jumlah baris duplikat terdeteksi: {len(dup_data)}")
            st.dataframe(dup_data[['comment']].head(10))
            
        with col_dup2:
            st.write("**Proses Drop Duplicates:**")
            df_raw_prep.drop_duplicates(subset="comment", inplace=True)
            st.write(f"Jumlah baris setelah drop duplicates: {len(df_raw_prep)}")

        if st.button("Jalankan Pembersihan Preprocessing Lengkap"):
            with st.spinner("Menjalankan seluruh pembersihan teks..."):
                df_raw_prep['cleaning'] = df_raw_prep['comment'].apply(remove_URL)
                df_raw_prep['cleaning'] = df_raw_prep['cleaning'].apply(remove_usernames)
                df_raw_prep['cleaning'] = df_raw_prep['cleaning'].apply(remove_html)
                df_raw_prep['cleaning'] = df_raw_prep['cleaning'].apply(remove_emoji)
                df_raw_prep['cleaning'] = df_raw_prep['cleaning'].apply(remove_symbols)
                df_raw_prep['cleaning'] = df_raw_prep['cleaning'].apply(remove_numbers)
                
                df_raw_prep['case_folding'] = df_raw_prep['cleaning'].apply(case_folding)
                
                df_raw_prep['normalisasi'] = df_raw_prep['case_folding'].apply(
                    lambda x: replace_taboo_words(x, kamus_tidak_baku_dict)
                )
                
                df_raw_prep['tokenize'] = df_raw_prep['normalisasi'].apply(lambda x: x.split() if isinstance(x, str) else [])
                
                hapus_kata_awal = set()
                df_raw_prep['stopword removal'] = df_raw_prep['tokenize'].apply(
                    lambda x: " ".join(remove_stopwords(x, hapus_kata_awal))
                )
                
                all_text_awal = ' '.join(df_raw_prep['stopword removal'].astype(str))
                all_text_awal = re.sub(r'[^a-zA-Z\s]', '', all_text_awal.lower())
                word_list_awal = all_text_awal.split()
                word_freq_awal = Counter(word_list_awal)
                sorted_freq_awal = sorted(word_freq_awal.items(), key=lambda x: x[1], reverse=True)
                df_freq_awal = pd.DataFrame(sorted_freq_awal, columns=['Kata', 'Frekuensi'])
                st.session_state.df_freq_awal = df_freq_awal
                
                hapus_kata_kustom = {'ya','tok','deh','wok','we','the','loh','sih',
                                     'roy','not','nih','cs','y','abang','bang','gue',
                                     'lo','kau','sok','ku','bu','tuh','gua'}
                
                df_raw_prep['stopword removal'] = df_raw_prep['stopword removal'].apply(
                    lambda x: ' '.join([kata for kata in str(x).split() if kata not in hapus_kata_kustom])
                )
                
                df_raw_prep = df_raw_prep[df_raw_prep['stopword removal'].str.strip() != '']
                
                st.session_state.df_preprocessed = df_raw_prep
                st.success("Seluruh tahapan preprocessing selesai dijalankan!")

        if st.session_state.df_preprocessed is not None:
            df_prep = st.session_state.df_preprocessed.copy()
            
            st.subheader("Dataframe Hasil Preprocessing Lengkap (Sampai 50 Baris)")
            st.dataframe(df_prep[['comment','cleaning','case_folding','normalisasi','stopword removal']].head(50))

            if st.session_state.df_freq_awal is not None:
                st.subheader("Analisis Frekuensi Kata Hasil Preprocessing")
                col_f1, col_f2 = st.columns([1, 2])
                with col_f1:
                    st.write("**Top 50 Frekuensi Kata:**")
                    st.dataframe(st.session_state.df_freq_awal.head(50))
                with col_f2:
                    st.write("Unduh data frekuensi kata awal hasil preprocessing:")
                    csv_freq = st.session_state.df_freq_awal.to_csv(index=False).encode('utf-8')
                    st.download_button("Download frekuensi_kata_awal.csv", csv_freq, "frekuensi_kata_awal.csv", "text/csv")

            st.subheader("Visualisasi Word Cloud (Sebelum vs Sesudah Preprocessing)")
            stopwords_wc = set(STOPWORDS)
            stopwords_wc.update(['https', 'co', 'RT', '...', 'amp', 'lu', 'jokowi'])

            text_before = ' '.join(df_prep['comment'].astype(str).tolist())
            cleaned_text_list = [ " ".join(x.split()) for x in df_prep['stopword removal'].astype(str) ]
            text_after = ' '.join(cleaned_text_list)

            fig_wc, ax_wc = plt.subplots(1, 2, figsize=(14, 6))
            
            wc_before = WordCloud(stopwords=stopwords_wc, background_color="white", max_words=200, width=800, height=400).generate(text_before)
            ax_wc[0].imshow(wc_before, interpolation='bilinear')
            ax_wc[0].axis("off")
            ax_wc[0].set_title("Before Preprocessing", fontsize=16, fontweight='bold')

            wc_after = WordCloud(stopwords=stopwords_wc, background_color="white", max_words=1000, width=800, height=400).generate(text_after)
            ax_wc[1].imshow(wc_after, interpolation='bilinear')
            ax_wc[1].axis("off")
            ax_wc[1].set_title("After Preprocessing", fontsize=16, fontweight='bold')
            st.pyplot(fig_wc)
            plt.close(fig_wc)

            st.subheader("Grafik Frekuensi Kata Terbanyak Sebelum vs Sesudah Preprocessing")
            all_text_before = clean_text_column(df_prep["comment"])
            words_before = [w for w in all_text_before.split() if w.lower() not in stopwords_wc]
            word_counts_before = Counter(words_before)
            top_words_before = word_counts_before.most_common(10)
            word_before, count_before = zip(*top_words_before)

            all_text_after = clean_text_column(df_prep["stopword removal"])
            words_after = [w for w in all_text_after.split() if w.lower() not in stopwords_wc]
            word_counts_after = Counter(words_after)
            top_words_after = word_counts_after.most_common(10)
            word_after, count_after = zip(*top_words_after)

            fig_bar, ax_bar = plt.subplots(1, 2, figsize=(15, 6))

            colors_before = plt.cm.Pastel1(range(len(word_before)))
            bars1 = ax_bar[0].bar(word_before, count_before, color=colors_before)
            ax_bar[0].set_title("Frekuensi Kata Sebelum Preprocessing", fontsize=12, fontweight='bold')
            ax_bar[0].tick_params(axis='x', rotation=45)
            for bar, count in zip(bars1, count_before):
                ax_bar[0].text(bar.get_x() + bar.get_width()/2, count + 1, str(count), ha='center', fontsize=9)

            colors_after = plt.cm.Pastel2(range(len(word_after)))
            bars2 = ax_bar[1].bar(word_after, count_after, color=colors_after)
            ax_bar[1].set_title("Frekuensi Kata Setelah Preprocessing", fontsize=12, fontweight='bold')
            ax_bar[1].tick_params(axis='x', rotation=45)
            for bar, count in zip(bars2, count_after):
                ax_bar[1].text(bar.get_x() + bar.get_width()/2, count + 1, str(count), ha='center', fontsize=9)

            st.pyplot(fig_bar)
            plt.close(fig_bar)

            csv_prep_down = df_prep.to_csv(index=False).encode('utf-8')
            st.download_button("Unduh Hasil Preprocessing Lengkap (CSV)", csv_prep_down, "Hasil_Preprocessing_Data.csv", "text/csv")


# ==========================================
# MENU 3: PELABELAN DATA
# ==========================================
elif menu == "3. Pelabelan Data InSet Lexicon":
    st.header("3. Pelabelan Data Menggunakan Metode Lexicon Based (2 Kelas)")

    if st.session_state.df_preprocessed is None:
        st.warning("Silakan selesaikan tahap preprocessing data terlebih dahulu di Menu '2. Preprocessing Data'.")
    else:
        df_labeling_proc = st.session_state.df_preprocessed.copy()
        
        if st.button("Mulai Proses Pelabelan Otomatis"):
            with st.spinner("Melakukan pelabelan data..."):
                df_labeling_proc[['Score', 'Sentiment']] = df_labeling_proc['stopword removal'].apply(
                    lambda x: pd.Series(determine_sentiment(x))
                )
                st.session_state.df_labeled = df_labeling_proc
                st.success("Proses pelabelan 2 kelas berhasil diselesaikan!")

        if st.session_state.df_labeled is not None:
            df_lab = st.session_state.df_labeled.copy()
            
            st.subheader("Hasil Pelabelan Dataset (Pratinjau 20 Baris Pertama)")
            st.dataframe(df_lab[['stopword removal', 'Score', 'Sentiment']].head(20))

            st.subheader("Diagram Distribusi Sentimen")
            sentiment_count = df_lab['Sentiment'].value_counts()
            
            fig_sent, ax_sent = plt.subplots(figsize=(6, 3.5))
            sns.barplot(x=sentiment_count.index, y=sentiment_count.values, palette='pastel', ax=ax_sent)
            ax_sent.set_title('Analisis Komentar YouTube Tentang\nKasus Korupsi Videografer di Sumut\n(InSet Lexicon)', fontsize=10, pad=15)
            ax_sent.set_xlabel('Klasifikasi Data', fontsize=8)
            ax_sent.set_ylabel('Jumlah Data', fontsize=8)

            total = len(df_lab)
            for i, count in enumerate(sentiment_count.values):
                percentage = f'{100 * count / total:.2f}%'
                ax_sent.text(i, count + 1, f'{count}\n({percentage})', ha='center', va='bottom', fontsize=8)
            st.pyplot(fig_sent)
            plt.close(fig_sent)

            st.subheader("Word Cloud Berdasarkan Sentimen (Positif vs Negatif)")
            text_positif = ' '.join(df_lab[df_lab['Sentiment'] == 'Positif']['stopword removal'].astype(str))
            text_negatif = ' '.join(df_lab[df_lab['Sentiment'] == 'Negatif']['stopword removal'].astype(str))

            if text_positif.strip() and text_negatif.strip():
                fig_pn, ax_pn = plt.subplots(1, 2, figsize=(14, 6))
                
                wc_pos = WordCloud(background_color='white', max_words=200, width=800, height=400, colormap='viridis').generate(text_positif)
                ax_pn[0].imshow(wc_pos, interpolation='bilinear')
                ax_pn[0].axis("off")
                ax_pn[0].set_title('Word Cloud Sentimen POSITIF', fontsize=16, color='green', fontweight='bold')

                wc_neg = WordCloud(background_color='white', max_words=200, width=800, height=400, colormap='magma').generate(text_negatif)
                ax_pn[1].imshow(wc_neg, interpolation='bilinear')
                ax_pn[1].axis("off")
                ax_pn[1].set_title('Word Cloud Sentimen NEGATIF', fontsize=16, color='red', fontweight='bold')
                st.pyplot(fig_pn)
                plt.close(fig_pn)

            csv_lab_down = df_lab.to_csv(index=False).encode('utf-8')
            st.download_button("Unduh Hasil Pelabelan Lengkap (CSV)", csv_lab_down, "Hasil_Labelling_Data_Inset_Lax.csv", "text/csv")


# ==========================================
# MENU 4: MODEL & EVALUASI ML (DENGAN SPLIT 80:20, 70:30, 60:40)
# ==========================================
elif menu == "4. Pemodelan & Evaluasi ML":
    st.header("4. Performa Model Berdasarkan Variasi Rasio Split Data (80:20, 70:30, 60:40)")

    if st.session_state.df_labeled is None:
        st.warning("Silakan jalankan proses pelabelan data terlebih dahulu di Menu '3. Pelabelan Data'.")
    else:
        df_ml = st.session_state.df_labeled.dropna(subset=['stopword removal', 'Sentiment'])
        
        if st.button("Latih & Evaluasi Semua Rasio Split Data"):
            with st.spinner("Sedang memproses seluruh pemodelan..."):
                X = df_ml['stopword removal']
                y = df_ml['Sentiment']

                split_ratios = {
                    "80:20": 0.2,
                    "70:30": 0.3,
                    "60:40": 0.4
                }

                results = {}

                for label, ratio in split_ratios.items():
                    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=ratio, random_state=42, stratify=y)
                    
                    vectorizer = CountVectorizer()
                    X_train_vec = vectorizer.fit_transform(X_train)
                    X_test_vec = vectorizer.transform(X_test)

                    models = {
                        "SVM": SVC(kernel='linear', random_state=42),
                        "Naive Bayes": MultinomialNB(),
                        "KNN": KNeighborsClassifier(n_neighbors=5)
                    }

                    trained_models = {}
                    preds = {}
                    accuracies = {}
                    reports = {}
                    matrices = {}

                    for model_name, model in models.items():
                        model.fit(X_train_vec, y_train)
                        y_pred = model.predict(X_test_vec)
                        
                        trained_models[model_name] = model
                        preds[model_name] = y_pred
                        accuracies[model_name] = accuracy_score(y_test, y_pred)
                        reports[model_name] = classification_report(y_test, y_pred, output_dict=True)
                        matrices[model_name] = confusion_matrix(y_test, y_pred)

                    results[label] = {
                        "X_train_len": len(X_train),
                        "X_test_len": len(X_test),
                        "X_test": X_test,
                        "y_test": y_test,
                        "vocab_size": X_train_vec.shape[1],
                        "vectorizer": vectorizer,
                        "models": trained_models,
                        "predictions": preds,
                        "accuracies": accuracies,
                        "reports": reports,
                        "confusion_matrices": matrices
                    }

                st.session_state.split_results = results
                st.success("Pelatihan semua variasi split data berhasil diselesaikan!")

        if st.session_state.split_results is not None:
            results = st.session_state.split_results

            st.subheader("I. Tabel Ringkasan Akurasi Komparatif")
            comparison_acc_data = []
            for split_name, res in results.items():
                comparison_acc_data.append({
                    "Rasio Split": split_name,
                    "SVM Accuracy": f"{res['accuracies']['SVM']:.4f} ({res['accuracies']['SVM']*100:.2f}%)",
                    "Naive Bayes Accuracy": f"{res['accuracies']['Naive Bayes']:.4f} ({res['accuracies']['Naive Bayes']*100:.2f}%)",
                    "KNN Accuracy": f"{res['accuracies']['KNN']:.4f} ({res['accuracies']['KNN']*100:.2f}%)",
                    "Ukuran Kosakata": res['vocab_size']
                })
            st.table(pd.DataFrame(comparison_acc_data))

            st.subheader("II. Visualisasi Grafik Perbandingan Akurasi Semua Rasio Split")
            
            splits = list(results.keys())
            svm_accs = [results[s]['accuracies']['SVM'] for s in splits]
            nb_accs = [results[s]['accuracies']['Naive Bayes'] for s in splits]
            knn_accs = [results[s]['accuracies']['KNN'] for s in splits]

            x = np.arange(len(splits))
            width = 0.25

            fig_grp, ax_grp = plt.subplots(figsize=(10, 5))
            rects1 = ax_grp.bar(x - width, svm_accs, width, label='SVM', color='lightskyblue')
            rects2 = ax_grp.bar(x, nb_accs, width, label='Naive Bayes', color='lightcoral')
            rects3 = ax_grp.bar(x + width, knn_accs, width, label='KNN', color='palegreen')

            ax_grp.set_ylabel('Nilai Akurasi', fontsize=10)
            ax_grp.set_title('Perbandingan Akurasi Model Berdasarkan Rasio Split Data', fontsize=12, fontweight='bold', pad=15)
            ax_grp.set_xticks(x)
            ax_grp.set_xticklabels(splits, fontsize=10)
            ax_grp.set_ylim(0, 1.1)
            ax_grp.legend(loc='upper right')

            def autolabel(rects):
                for rect in rects:
                    height = rect.get_height()
                    ax_grp.annotate(f'{height:.2f}',
                                xy=(rect.get_x() + rect.get_width() / 2, height),
                                xytext=(0, 3),
                                textcoords="offset points",
                                ha='center', va='bottom', fontsize=8)

            autolabel(rects1)
            autolabel(rects2)
            autolabel(rects3)

            st.pyplot(fig_grp)
            plt.close(fig_grp)

            st.subheader("III. Detail Laporan Evaluasi Berdasarkan Pembagian Data")
            tab_80, tab_70, tab_60 = st.tabs(["Rasio 80:20", "Rasio 70:30", "Rasio 60:40"])

            def render_tab_content(split_key):
                res = results[split_key]
                
                col_i1, col_i2 = st.columns(2)
                with col_i1:
                    st.write(f"**Ukuran Data Latih:** {res['X_train_len']} baris")
                    st.write(f"**Ukuran Data Uji:** {res['X_test_len']} baris")
                with col_i2:
                    st.write(f"**Dimensi Fitur (Vektor):** {res['vocab_size']} kolom unik")

                fig_sp, ax_sp = plt.subplots(figsize=(6, 2.5))
                ax_sp.barh(['Data Latih', 'Data Uji'], [res['X_train_len'], res['X_test_len']], color=['blue', 'orange'])
                ax_sp.set_title("Proporsi Data Latih vs Data Uji")
                st.pyplot(fig_sp)
                plt.close(fig_sp)

                st.write("**Confusion Matrix Komparasi:**")
                col_cm1, col_cm2, col_cm3 = st.columns(3)
                
                for i, (name, matrix) in enumerate(res['confusion_matrices'].items()):
                    fig_cm, ax_cm = plt.subplots(figsize=(3.5, 3.5))
                    sns.heatmap(matrix, annot=True, fmt='d', cmap="YlGnBu", cbar=False,
                                xticklabels=['Negatif', 'Positif'], yticklabels=['Negatif', 'Positif'], ax=ax_cm, square=True)
                    ax_cm.set_title(f"Matrix {name}")
                    ax_cm.set_xlabel("Predicted")
                    ax_cm.set_ylabel("Actual")
                    
                    if name == "SVM":
                        col_cm1.pyplot(fig_cm)
                    elif name == "Naive Bayes":
                        col_cm2.pyplot(fig_cm)
                    else:
                        col_cm3.pyplot(fig_cm)
                    plt.close(fig_cm)

                st.write("**Classification Report Gabungan:**")
                reports_list = []
                for name, report_dict in res['reports'].items():
                    df_rep = pd.DataFrame(report_dict).transpose()
                    df_rep['Model'] = name
                    reports_list.append(df_rep)
                
                comb_rep_df = pd.concat(reports_list).reset_index().rename(columns={'index': 'Metric'})
                comb_rep_df = comb_rep_df[['Model', 'Metric', 'precision', 'recall', 'f1-score', 'support']]
                st.dataframe(comb_rep_df.style.background_gradient(cmap="coolwarm").format(precision=3))

                st.write("**Tabel Sampel Hasil Prediksi Uji:**")
                comparison_df = pd.DataFrame({
                    'Komentar Uji': res['X_test'],
                    'Aktual (Lexicon)': res['y_test'],
                    'Prediksi SVM': res['predictions']['SVM'],
                    'Prediksi Naive Bayes': res['predictions']['Naive Bayes'],
                    'Prediksi KNN': res['predictions']['KNN']
                })
                st.dataframe(comparison_df.head(15))

            with tab_80:
                render_tab_content("80:20")
            with tab_70:
                render_tab_content("70:30")
            with tab_60:
                render_tab_content("60:40")


# ==========================================
# MENU 5: PREDIKSI TEKS BARU
# ==========================================
elif menu == "5. Prediksi Sentimen Teks Baru":
    st.header("5. Uji Prediksi Komentar Baru Secara Interaktif")

    if st.session_state.split_results is None:
        st.warning("Silakan latih model terlebih dahulu di Menu '4. Pemodelan & Evaluasi ML'.")
    else:
        st.write("Gunakan fitur ini untuk memproses dan menganalisis teks kustom secara real-time.")

        selected_split = st.selectbox(
            "Pilih Rasio Model yang Ingin Digunakan untuk Prediksi:",
            ["80:20", "70:30", "60:40"]
        )

        user_text = st.text_area("Masukkan teks komentar kustom Anda di sini:", value="keren banget bang ferry, terus kawal kasus korupsi ini sampai tuntas!")

        if st.button("Uji Prediksi Sentimen"):
            if user_text.strip() == "":
                st.warning("Kotak input teks tidak boleh kosong.")
            else:
                cleaned = remove_URL(user_text)
                cleaned = remove_usernames(cleaned)
                cleaned = remove_html(cleaned)
                cleaned = remove_emoji(cleaned)
                cleaned = remove_symbols(cleaned)
                cleaned = remove_numbers(cleaned)
                folded = case_folding(cleaned)
                normalized = replace_taboo_words(folded, kamus_tidak_baku_dict)
                tokens = normalized.split()

                hapus_kata_kustom = {'ya','tok','deh','wok','we','the','loh','sih',
                                     'roy','not','nih','cs','y','abang','bang','gue',
                                     'lo','kau','sok','ku','bu','tuh','gua'}

                cleaned_stopwords = remove_stopwords(tokens, hapus_kata_kustom)
                final_clean_text = " ".join(cleaned_stopwords)

                st.info(f"**Teks Hasil Preprocessing:** *\"{final_clean_text}\"*")

                if final_clean_text.strip() == "":
                    st.warning("Teks Anda kosong setelah disaring melalui stopwords.")
                else:
                    split_data = st.session_state.split_results[selected_split]
                    active_vectorizer = split_data["vectorizer"]
                    active_models = split_data["models"]

                    vec_text = active_vectorizer.transform([final_clean_text])

                    col_pred1, col_pred2, col_pred3 = st.columns(3)
                    
                    with col_pred1:
                        st.metric(label=f"Prediksi SVM ({selected_split})", value=active_models['SVM'].predict(vec_text)[0])
                    with col_pred2:
                        st.metric(label=f"Prediksi Naive Bayes ({selected_split})", value=active_models['Naive Bayes'].predict(vec_text)[0])
                    with col_pred3:
                        st.metric(label=f"Prediksi KNN ({selected_split})", value=active_models['KNN'].predict(vec_text)[0])