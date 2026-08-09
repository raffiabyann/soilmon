# Spesifikasi Desain Dashboard SoilMon

Dokumen ini berisi spesifikasi teknis dan rincian konten (*blueprint*) untuk membangun antarmuka pengguna (UI) Dashboard "SoilMon - Soil Monitoring System" persis 100% sesuai dengan desain referensi.

---

## 1. Panduan Visual (Design System)

### 1.1. Palet Warna (Perkiraan Hex)
*   **Warna Utama (Primary):**
    *   Hijau Gelap (Sidebar Background): `#0F6B32`
    *   Hijau Aktif (Sidebar Active Item): `#1B8543`
    *   Hijau Terang (Status Online / Trend Naik): `#22C55E` atau `#16A34A`
*   **Warna Latar (Background):**
    *   Background Utama: `#F8FAFC` (Light Gray/Off-white)
    *   Background Card (Wadah konten): `#FFFFFF` (Putih Murni)
*   **Warna Teks (Typography):**
    *   Teks Utama (Judul/Angka): `#1E293B` (Slate-800)
    *   Teks Sekunder (Subtitle/Label): `#64748B` (Slate-500)
    *   Teks Sidebar (Putih): `#FFFFFF`
*   **Warna Peringatan (Alerts/Status):**
    *   Biru (Moisture): `#3B82F6`
    *   Oranye (pH Warning/Battery Low): `#F97316`
    *   Merah (pH Critical): `#EF4444`

### 1.2. Tipografi & Gaya (Styling)
*   **Font Family:** Sans-serif modern (seperti Inter, Roboto, atau Segoe UI).
*   **Borders & Shadows:**
    *   Border Radius (Card): `8px` - `12px` (Melingkar lembut).
    *   Box Shadow: Bayangan sangat halus pada card (`box-shadow: 0 1px 3px rgba(0,0,0,0.05)`).
*   **Ornamen Tambahan:**
    *   Terdapat pola daun (*leaf pattern watermark*) transparan di bagian bawah Sidebar dan di sudut kanan bawah area Footer.

---

## 2. Struktur Tata Letak (Layout Architecture)

Aplikasi ini menggunakan layout klasik Dashboard (CSS Grid / Flexbox direkomendasikan):
1.  **Sidebar Kiri:** Lebar tetap (fixed width, approx. 250px-280px), tinggi 100vh, *sticky/fixed*.
2.  **Konten Utama (Kanan):** Mengisi sisa ruang, dapat di-scroll (overflow-y: auto). Terdiri dari Header, 4 Baris Konten, dan Footer.

---

## 3. Rincian Komponen & Konten (Pixel-Perfect Mapping)

### A. Sidebar (Kiri)
*   **Header Logo:**
    *   Icon: Daun (Putih).
    *   Judul Utama: **SoilMon** (Bold, Putih).
    *   Sub-judul: Soil Monitoring System (Regular, Putih transparan/abu).
*   **Menu Navigasi (List Vertikal):**
    *   [Icon Home] **Dashboard** (Status Aktif: Background Hijau lebih muda, border/radius penuh).
    *   [Icon Line Chart] Data History
    *   [Icon Bell] Alerts
    *   [Icon Document] Reports
    *   [Icon Gear] Settings
*   **Widget Status Bawah (Bottom Section):**
    *   [Dot Hijau] **Gateway Online** (Bold, Putih).
    *   Last Sync: `10:24 WIB` (Ukuran font kecil, putih).
    *   Toggle "Auto Refresh": Tombol Switch (Posisi ON/Hijau).
    *   *Catatan:* Area ini memiliki background pola ukiran daun berwarna hijau muda transparan.

### B. Konten Utama - Header Bar
*   **Judul Halaman (Kiri):**
    *   Judul: **Dashboard** (Teks besar, Slate-800).
    *   Sub-judul: Monitoring overview (Teks kecil, Slate-500).
*   **Area Utilitas (Kanan):** (Dipisahkan garis vertikal tipis `|`)
    *   **Logo Mitra:** Jejeran 4 logo (Hiliriset, UMN Universitas Multimedia Nusantara, FTI, Dekatif Relentless Innovation).
    *   **Tanggal/Waktu:** `09 Aug 2026` (Atas), `10:24 WIB` (Bawah).
    *   **Auto Refresh:** Icon Refresh + Teks "Auto Refresh ON" (Teks hijau).
    *   **Theme Switcher:** Teks "Theme" dengan Toggle Icon Matahari (Sun) & Bulan (Moon).

### C. Baris 1: Summary Cards (Grid 4 Kolom)
Masing-masing card berwarna putih, padding merata, icon di sebelah kiri (dibungkus kotak dengan background warna pudar sesuai icon).
1.  **Card 1 (Gateway Status):**
    *   Icon: WiFi (Hijau di dalam kotak hijau pudar).
    *   Label: Gateway Status
    *   Nilai: **Online** (Teks warna hijau besar).
    *   Sub-label: Last Sync: 10:24 WIB.
2.  **Card 2 (Data Received):**
    *   Icon: Database (Biru di dalam kotak biru pudar).
    *   Label: Data Received (Today)
    *   Nilai: **1,248**
    *   Sub-label: records. (Di ujung kanan card ada icon bar-chart biru kecil).
3.  **Card 3 (Data Trend):**
    *   Icon: Line Chart (Hijau di dalam kotak hijau pudar).
    *   Label: Data Trend (24 Hours)
    *   Nilai: **+12.4%** (Teks warna hijau).
    *   Sub-label: vs yesterday. (Di ujung kanan card ada grafik garis sparkline hijau kecil).
4.  **Card 4 (System Uptime):**
    *   Icon: Jam (Ungu di dalam kotak ungu pudar).
    *   Label: System Uptime
    *   Nilai: **99.8%**
    *   Sub-label: 7 hari 14 jam.

### D. Baris 2: Main Chart Area
*   **Card Background:** Putih penuh, membentang 100% lebar kontainer.
*   **Header Chart:**
    *   Judul: **Environmental Overview (24 Hours)**.
    *   Dropdown di Kanan: "24 Hours v" (Bordered button).
*   **Legenda Chart:**
    *   [Dot Hijau] Temperature (°C)
    *   [Dot Biru] Moisture (%)
    *   [Dot Oranye] pH
*   **Area Grafik (Multi-line chart):**
    *   Sumbu X (Bawah): Waktu (`00:00`, `04:00`, `08:00`, `12:00`, `16:00`, `20:00`, `24:00`).
    *   Sumbu Y Kiri: Rentang `0` sampai `40` (Untuk Suhu dan Kelembapan).
    *   Sumbu Y Kanan: Rentang `0` sampai `14` (Untuk pH).
    *   Garis Grafik: Garis kurva mulus (*smooth line*) dengan titik (*dots*) di setiap data poin.
        *   Garis Hijau (Suhu): Berada di kisaran nilai 30-40.
        *   Garis Biru (Kelembapan): Berada di kisaran nilai 20-30.
        *   Garis Oranye (pH): Berada konstan di bawah nilai 10 (sekitar angka 7 berdasarkan skala kanan).

### E. Baris 3: Node Status Cards (Grid 4 Kolom)
Card untuk masing-masing sensor node. Struktur seragam:
*   Header: Icon Daun Hijau kotak, Nama Node (Bold), Lokasi (Small text abu-abu), Status [Dot Hijau] Online (Kanan atas).
*   Metrik Utama (3 kolom berjejer):
    *   **Temp:** Nilai besar + `°C` (kecil), label bawah "Temp".
    *   **Moisture:** Nilai besar + `%` (kecil), label bawah "Moisture".
    *   **pH:** Nilai besar, label bawah "pH".
*   Footer Info (Icon kecil sejajar, teks kecil abu-abu):
    *   [Battery Icon] % Baterai
    *   [Signal Icon] dBm Sinyal
    *   [Clock Icon] Jam update

**Data per Node:**
1.  **Node 1:** Kebun Utara | Temp: 28.5 °C | Moist: 65% | pH: 6.5 | Bat: 92% | Sig: -67 dBm | Time: 10:24 WIB
2.  **Node 2:** Kebun Tengah | Temp: 32.5 °C | Moist: 55% | pH: 6.2 | Bat: 85% | Sig: -70 dBm | Time: 10:24 WIB
3.  **Node 3:** Kebun Selatan | Temp: 27.8 °C | Moist: 58% | pH: **4.8** (Teks warna Merah) | Bat: 78% | Sig: -72 dBm | Time: 10:24 WIB
4.  **Node 4:** Kebun Barat | Temp: 29.1 °C | Moist: 62% | pH: **8.1** (Teks warna Oranye) | Bat: 70% | Sig: -72 dBm | Time: 10:24 WIB

### F. Baris 4: Bottom Widgets (Grid 2 Kolom, Kiri 60% / Kanan 40%)
**Kolom Kiri: Recent Alerts (Card Putih)**
*   Header: [Icon Bell] **Recent Alerts**. Link di Kanan: "View all alerts ->" (Teks hijau).
*   List Item (Flex row, dipisahkan garis bawah sangat tipis):
    1.  [Icon Alert Oranye di kotak persegi]: **pH Level Warning** | Node 3 (Kebun Selatan) - pH is below normal range | (Kanan: `10:15 WIB`).
    2.  [Icon Tetesan Air Biru di kotak persegi]: **Moisture Low** | Node 2 (Kebun Tengah) - Soil moisture is low | (Kanan: `09:45 WIB`).
    3.  [Icon Baterai Oranye di kotak persegi]: **Battery Low** | Node 3 (Kebun Selatan) - Battery level is 78% | (Kanan: `09:30 WIB`).

**Kolom Kanan: System Information (Card Putih)**
*   Header: [Icon Info (i)] **System Information**.
*   List Item (Flex row between, dipisahkan garis bawah sangat tipis):
    1.  [Icon Shield/Check] Firmware Version: **v1.2.3**
    2.  [Icon WiFi] Network: **LoRa 868 MHz**
    3.  [Icon WiFi Signal] WiFi Signal: **-61 dBm**
    4.  [Icon Clock] Last Sync: **10:24 WIB**

### G. Footer Area
*   Posisi: Rata tengah, paling bawah.
*   Teks Atas (Kecil, Abu-abu): `ENGINEERED FOR PRECISION BY`
*   Teks Bawah (Tebal/Bold, Hitam/Slate-800): `UNIVERSITAS MULTIMEDIA NUSANTARA & PT. IDE KREATIF TEKNOLOGI`
*   Catatan: Terdapat ornamen daun air (*watermark*) samar di area latar belakang kanan layar.
