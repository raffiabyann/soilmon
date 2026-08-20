# SoilMon

**SoilMon** adalah web dashboard untuk monitoring kondisi tanah, lingkungan, dan power sistem (solar panel) yang dikembangkan sebagai bagian dari proyek R&D sistem pertanian cerdas. Repository ini berisi frontend prototype yang dibuat untuk memvisualisasikan struktur sistem sebelum hardware fisik tersedia.

---

## Status Project

> **Prototype / Development Stage**

Seluruh data yang ditampilkan saat ini adalah **simulated/mock data** — bukan pembacaan sensor nyata. Prototype ini dibangun untuk:

- Mendemonstrasikan struktur UI dan alur informasi sistem SoilMon
- Menyiapkan arsitektur frontend sebelum hardware dan gateway tersedia
- Menjadi baseline untuk integrasi data nyata setelah R&D hardware selesai

Belum ada hardware sensor, gateway, atau backend yang terhubung ke prototype ini.

---

## Fitur Saat Ini

### Dashboard
Halaman utama yang menampilkan ringkasan sistem secara keseluruhan:
- **KPI Cards** — Gateway Status, Data Received, Data Trend, System Uptime (nilai saat ini masih placeholder `—`, kecuali Gateway Status yang menampilkan "Online · Simulated")
- **Environmental Overview** — Chart 24 jam untuk temperature, moisture, dan pH menggunakan data simulasi
- **Node Grid** — Status 4 monitoring node dengan telemetri per node (temperature, moisture, pH, battery, signal)
- **Power Monitor** — Monitoring solar panel dan baterai (lihat bagian tersendiri di bawah)
- **Recent Alerts** — Panel alert terbaru dengan link ke halaman Alerts
- **System Information** — Informasi gateway (nilai saat ini placeholder `—`)

### Power Monitor (Solar Panel)
Modul monitoring daya yang merupakan salah satu requirement utama proyek:
- Stat tiles: **Battery %** dan **Solar Input (W)** — data simulasi dengan pola diurnal siang/malam
- Chart 24 jam: solar output vs battery level
- Charging status badge (saat ini `Unknown` karena hardware belum terkonfirmasi)
- Voltage dan current tersedia di data model tetapi belum ditampilkan di UI, menunggu konfirmasi spesifikasi hardware

### Alerts
Sistem peringatan berbasis kategori sensor:
- List alert dengan filter severity (All / Error / Warning / Info)
- Count badge per kategori
- Saat ini hanya menampilkan alert infrastruktur/konektivitas (contoh: Signal Weak) — alert berbasis threshold sensor **belum diimplementasikan** karena threshold belum dikonfirmasi dari R&D
- Empty state ketika tidak ada alert di kategori tertentu

### Irrigation Zones
Tampilan zona irigasi sebagai **struktur placeholder** untuk integrasi masa depan:
- Menampilkan 4 zona irigasi dengan nama dan lokasi
- Status semua zona: `Unknown` — belum ada hardware aktuator yang terhubung
- Tidak ada kontrol on/off atau otomasi — menunggu spesifikasi hardware

### Data History
Tabel riwayat pembacaan sensor:
- 480 record simulasi (4 node × 5 metrik × 24 jam)
- Filter per node dan per metrik
- Pagination 20 baris per halaman
- Semua record mock menggunakan `status: "ok"` — tidak ada anomali yang difabrikasi

### Reports & Analytics
Analisis statistik dari data riwayat 24 jam (lihat bagian tersendiri di bawah).

### Auto Refresh
Toggle auto-refresh dengan interval 10 detik. Memperbarui nilai telemetri live (node, environmental series, power tiles) tanpa mengubah data historis.

### Navigasi & Responsive
- Sidebar desktop + mobile drawer dengan keyboard navigation
- Semua halaman responsif untuk desktop dan mobile
- Light/dark theme toggle

### Settings
Halaman stub — belum diimplementasikan, menunggu kebutuhan konfigurasi dari R&D.

---

## Data & Hardware Status

| Komponen | Status |
|---|---|
| Sensor tanah (temperature, moisture, pH) | Simulated — pola diurnal sintetis |
| Battery & Solar Input | Simulated — kurva siang/malam ilustratif |
| Voltage & Current | Ada di data model, belum ditampilkan di UI |
| Gateway | Simulated — status "Online" adalah placeholder |
| Alert threshold | Belum ditentukan — menunggu hasil R&D hardware |
| Irrigation actuator | Belum ada — zona ditampilkan sebagai placeholder |
| Backend/API | Belum ada — semua data dari mock di frontend |

Ketika hardware tersedia, hanya satu titik integrasi yang perlu diubah: fungsi `getDashboardData()` di `src/data/adapter/dashboardAdapter.ts`. Seluruh komponen UI tidak perlu dimodifikasi.

---

## Reports & Analytics

Halaman Reports menampilkan analisis statistik deterministik dari data riwayat 24 jam:

- **Ringkasan per Node** — Min, Average, Max per metrik untuk setiap node
- **Trend direction** — Perbandingan mean 6 pembacaan terakhir vs 6 sebelumnya (naik/turun/stabil)
- **Cross-node comparison** — Perbandingan nilai antar node per metrik, diurutkan tertinggi ke terendah

Semua hasil analytics dihitung dari **simulated data** dan ditampilkan dengan disclaimer yang jelas. Anomaly detection ada di arsitektur tetapi disembunyikan dari UI selama data masih mock, karena anomali hanya bermakna jika berasal dari threshold nyata.

> Analytics ini **bukan AI/ML**. Ini adalah analisis statistik sederhana yang deterministik. Eksplorasi AI/advanced analytics direncanakan setelah data sensor nyata tersedia dalam jumlah yang memadai.

---

## Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5.7 | Type safety |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | 3.4 | Styling |
| Recharts | 2.15 | Chart (Environmental & Power) |
| React Router | 6.30 | Client-side routing |
| Lucide React | 0.469 | Icon system |

Tidak ada backend, database, atau external API yang digunakan saat ini.

---

## Struktur Project

```
src/
├── app/
│   ├── pages/          # Halaman utama (Dashboard, Alerts, DataHistory, Reports, Settings)
│   ├── App.tsx          # Router root
│   ├── Layout.tsx       # Shell layout (sidebar + header + content)
│   └── AutoRefreshProvider.tsx  # Context untuk auto-refresh state
│
├── components/
│   ├── dashboard/      # Komponen dashboard (NodeCard, MetricCard, PowerMonitorSection, dll)
│   ├── layout/         # Shell komponen (Sidebar, Header, MobileNav, SidebarStatus)
│   └── ui/             # Komponen reusable (Card, StatusBadge, ThemeToggle)
│
├── data/
│   ├── mock/           # Mock/simulated data (dashboard.mock.ts)
│   └── adapter/        # Seam integrasi data (dashboardAdapter.ts)
│
├── hooks/
│   ├── useDashboardData.ts   # Hook utama — polling data dari adapter
│   └── useAnalytics.ts       # Hook analytics — komputasi dari history data
│
├── lib/
│   ├── analytics.ts    # Engine analisis statistik (pure functions, no React)
│   ├── icons.ts        # Registry icon terpusat (lucide-react)
│   └── time.ts         # WIB time formatting utilities
│
└── types/
    └── dashboard.ts    # Semua type definitions (DashboardData, NodeData, PowerData, dll)
```

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Clone repository
git clone <repo-url>
cd soilmon

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Development server akan berjalan di `http://localhost:5173`.

**Commands lain:**

```bash
npm run build       # Production build
npm run preview     # Preview production build
npm run typecheck   # Type check tanpa build
```

---

## Prototype Architecture

```
Mock / Simulated Data (src/data/mock/dashboard.mock.ts)
        │
        ▼
Data Adapter (src/data/adapter/dashboardAdapter.ts)
← Titik integrasi hardware/backend di masa depan →
        │
        ▼
useDashboardData Hook (src/hooks/useDashboardData.ts)
Polling setiap 10s, auto-refresh via context
        │
        ├──▶ UI Components & Pages
        │    (Dashboard, Alerts, DataHistory, Reports)
        │
        └──▶ useAnalytics Hook (src/hooks/useAnalytics.ts)
             └──▶ analytics.ts (pure computation)
                  └──▶ ReportsPage
```

---

## Current Limitations

- **Semua data adalah simulasi** — tidak ada koneksi ke sensor, gateway, atau backend nyata
- **Threshold alert belum ditentukan** — nilai sensor warning/error belum memiliki dasar dari hasil R&D hardware
- **Irrigation automation belum ada** — zona irigasi hanya ditampilkan sebagai struktur UI, bukan sistem kontrol aktual
- **Gateway status adalah placeholder** — "Online · Simulated" bukan status gateway nyata
- **Data History terbatas 24 jam** — arsitektur mendukung data lebih banyak, tetapi saat ini hanya ada 480 record simulasi
- **Settings page belum diimplementasikan** — menunggu kebutuhan konfigurasi sistem yang jelas dari R&D

---

## Next Development

Urutan pengembangan setelah hardware tersedia:

1. **Integrasi hardware/gateway** — Implement `getDashboardData()` di adapter dengan transport nyata (MQTT/REST/WebSocket sesuai kontrak gateway)
2. **Konfirmasi sensor/parameter** — Sesuaikan `NodeData.telemetry` dengan metrik yang benar-benar digunakan hardware (jenis sensor, unit, range)
3. **Kalibrasi Power Monitor** — Konfirmasi range voltage/current dari charge controller, aktifkan tiles yang sekarang disembunyikan
4. **Definisi alert rules** — Tentukan threshold berdasarkan hasil pengujian sensor, implement rule engine di `alertEngine.ts`
5. **Integrasi irigasi** — Hubungkan kondisi sensor → alert → trigger irigasi setelah aktuator dan protokol kontrol tersedia
6. **Real data history** — Implement backend query untuk data historis, gantikan `buildTelemetryHistory()`
7. **Analytics dari data nyata** — Set `isMockData: false`, validasi analisis dari pembacaan sensor sesungguhnya
8. **Eksplorasi AI/advanced analytics** — Evaluasi setelah data nyata tersedia dalam jumlah memadai

---

## Notes for Contributors

Prototype ini masih aktif berkembang mengikuti progress R&D hardware. Beberapa hal yang perlu diperhatikan:

- Jangan hardcode threshold atau nilai sensor spesifik tanpa konfirmasi dari tim hardware
- Semua data simulasi berada di `src/data/mock/dashboard.mock.ts` — jangan modifikasi komponen UI untuk menyesuaikan data, modifikasi mock atau adapter-nya
- Setiap field yang belum dikonfirmasi hardware diberi komentar `// TBD(hardware):` di source code
- Saat hardware tersedia, hanya `src/data/adapter/dashboardAdapter.ts` yang perlu diubah untuk integrasi data — komponen UI tidak perlu dimodifikasi

---

## License

Belum ditentukan. Bagian ini akan diperbarui setelah keputusan lisensi project.
