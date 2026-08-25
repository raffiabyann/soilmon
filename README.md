# SoilMon

SoilMon adalah prototype web dashboard untuk monitoring kondisi tanah, lingkungan, dan power/solar panel.

Project ini masih dalam tahap pengembangan dan akan terus disesuaikan dengan hasil R&D serta hardware yang digunakan.

## Status

**Ongoing — Prototype**

Saat ini web masih menggunakan data simulasi/mock karena hardware dan sistem pembacaan sensor masih dalam tahap pengembangan.

Prototype ini digunakan sebagai gambaran awal untuk:
- Monitoring sensor dan kondisi lingkungan
- Monitoring power/solar panel
- Sistem alerts
- Persiapan integrasi irigasi
- Data history dan analisis data

## Fitur Saat Ini

- Dashboard monitoring
- Monitoring temperature, moisture, pH, battery, dan signal
- Environmental monitoring dengan chart
- Power monitoring untuk solar panel dan battery
- Alerts
- Irrigation zones sebagai placeholder untuk pengembangan selanjutnya
- Data history
- Reports & basic analytics
- Responsive untuk desktop dan mobile

## Notes

Beberapa bagian pada prototype masih bersifat sementara dan akan disesuaikan setelah RnD Hardwarenya

Contohnya:
- Data sensor masih berupa simulated data
- Threshold untuk alert belum ditentukan
- Integrasi otomasi irigasi belum terhubung ke hardware
- Parameter power seperti voltage/current masih menunggu spesifikasi hardware
- Pengembangan AI/analisis lebih lanjut akan dievaluasi setelah data nyata sudah tersedia

Jadi tampilan dan fitur yang ada saat ini merupakan **baseline prototype**, bukan representasi final dari sistem.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts

## Development

```bash
npm install
npm run dev
