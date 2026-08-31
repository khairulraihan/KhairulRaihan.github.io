@echo off
:: Mengarahkan terminal otomatis ke folder tempat berkas .bat ini berada
cd /d "%~dp0"

echo Membuka Aplikasi Dashboard Skripsi...
echo Silakan tunggu sebentar...

:: Menjalankan aplikasi Streamlit
python -m streamlit run app.py

:: Menahan jendela command prompt jika terjadi error agar tidak langsung tertutup
pause