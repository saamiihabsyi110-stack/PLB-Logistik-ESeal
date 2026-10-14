# Sistem Logistik Lintas Batas (PLB) & E-Seal Terintegrasi - Kelompok 8
**Migrasi Modular PHP & MySQL Database**

Aplikasi ini telah berhasil dimigrasikan dari file monolitik tunggal (`Index.html`, 6.500+ baris) menjadi struktur modular berbasis **PHP** dan database **MySQL** dengan **mempertahankan 100% tampilan visual, animasi 3D Three.js, styling Tailwind CSS, dan fungsionalitas aslinya**.

---

## 📁 Struktur File & Direktori Proyek

```
c:\xampp\htdocs\PLB\
├── config/
│   └── database.php           # Konfigurasi koneksi database MySQL menggunakan PDO
├── database/
│   ├── schema.sql             # Skema DDL lengkap & data awal (seed) 15 tabel MySQL
│   └── seed.php               # Skrip PHP untuk migrasi / seed database via CLI atau web
├── api.php                    # REST API Controller untuk sinkronisasi data frontend & MySQL
├── index.php                  # Titik masuk utama (Main Entry Point) aplikasi PHP
├── includes/
│   ├── header.php             # Tag HTML <head>, library CDN (Tailwind, Three.js, FontAwesome, dll.)
│   ├── command_nav.php        # Navigasi Command Bar atas & menu accordion
│   ├── top_header.php         # Header status (Breadcrumb, kontrol kecepatan simulasi, jam, role)
│   ├── quick_sidebar.php      # Panel sidebar cepat (Enterprise & Quick Control)
│   ├── modals.php             # Seluruh popup modal (Case, Tim, SPPB, E-Seal QR, Payload JSON)
│   └── footer.php             # Penutupan tag HTML & inisialisasi skrip JavaScript
├── views/
│   ├── tab_ops.php            # Workspace operasional dinamis (Control Tower, Gate, Yard, WMS)
│   ├── tab_simulasi.php       # Tampilan simulasi 3D pelabuhan, HUD CCTV, kontrol telemetri & log
│   ├── tab_layers.php         # Tampilan diagram 4-Layer Arsitektur Sistem PLB
│   ├── tab_dwelling.php       # Tampilan analisis Dwelling Time
│   ├── tab_customs.php        # Tampilan alur kepabeanan & status clearance
│   ├── tab_manifest.php       # Tabel manifes peti kemas (terkoneksi langsung ke database MySQL)
│   ├── tab_fleet.php          # Tabel armada truk & status IoT E-Seal (terkoneksi ke database MySQL)
│   └── tab_wms.php            # Denah alokasi rak & zona gudang PLB
├── assets/
│   ├── css/
│   │   └── style.css          # Seluruh custom styling CSS, keyframes, scrollbar & layout
│   └── js/
│       ├── sim3d.js           # Engine simulasi 3D Three.js pelabuhan, truk, crane, avatar & suara
│       ├── app.js             # Logika aplikasi inti yang tersinkronisasi dua arah dengan MySQL
│       ├── command_nav.js     # Logika interaktif dropdown command navigation & search
│       └── quick_sidebar.js   # Logika interaktif tombol & panel quick sidebar
├── Index.html                 # Pengalihan otomatis (redirect) ke index.php
└── Index.html.bak             # Backup lengkap file HTML monolitik asli
```

---

## 🗄️ Struktur Database MySQL (`plb_db`)

Database yang digunakan adalah `plb_db` dengan tabel-tabel terstruktur sebagai berikut:

1. **`cases`**
   - Menyimpan seluruh data shipment & peti kemas sebagai *Single Source of Truth*.
   - Kolom: `container_no` (PK), `shipment_id`, `bl_number`, `importer`, `origin`, `destination`, `cargo`, `hs_code`, `gross_weight`, `customs_status`, `customs_stage`, `customs_stage_index`, `gate_status`, `yard_location`, `rfid_status`, `eseal_status`, `eseal_id`, `truck_plate`, `customs_document`, `documents` (JSON), `timeline` (JSON), `alerts` (JSON), `updated_at`.
2. **`audit_trail`**
   - Mencatat jejak audit operasional dan sistem secara *real-time*.
   - Kolom: `id` (PK, AI), `log_time`, `actor`, `container_no`, `severity`, `action`, `detail`, `created_at`.
3. **`enterprise_requirements`**
   - Daftar kebutuhan fungsional & non-fungsional modul enterprise.
4. **`enterprise_tests`**
   - Test case QA dan pemetaan traceability ke requirement.
5. **`enterprise_defects`**
   - Daftar bug / defect issue tracking.
6. **`enterprise_assets`**
   - Manajemen aset pelabuhan (Quay Crane, RTG, Forklift, Generator) beserta health status dan jam operasional.
7. **`enterprise_workorders`**
   - Surat perintah kerja (Work Order) pemeliharaan aset.
8. **`enterprise_spare_parts`**
   - Stok dan reservasi suku cadang peralatan logistik.
9. **`enterprise_costs`**
   - Monitoring anggaran vs realisasi biaya (OPEX, CAPEX, Maintenance).
10. **`enterprise_changes`**
    - Change Request (CR) dan analisis dampak perubahan proses bisnis.
11. **`enterprise_risks`**
    - Risk register & mitigasi operasional PLB.
12. **`enterprise_stakeholders`**
    - Matriks RACI stakeholder operasional.
13. **`enterprise_notifications`**
    - Notifikasi peringatan dini operasional & sistem.
14. **`fleet_armada`**
    - Data real-time armada truk ekspedisi dan telemetri IoT E-Seal (lokasi, baterai, sinyal, status gembok).
15. **`manifest_items`**
    - Daftar manifes muatan dokumen BC23 dari Singapore ke PLB.

---

## 🚀 Cara Menjalankan & Reset Database

### 1. Menjalankan di Localhost (XAMPP):
- Pastikan Apache dan MySQL di XAMPP Control Panel dalam status **Running**.
- Buka browser dan akses:
  ```
  http://localhost/PLB/
  ```
  *(Apache akan otomatis memuat `index.php`)*.

### 2. Reset / Inisialisasi Ulang Database:
Database sudah dibuat dan diisi secara otomatis. Namun bila ingin me-reset kembali data awal, Anda dapat menjalankan perintah berikut melalui terminal:
```bash
php database/seed.php
```
atau import langsung file `database/schema.sql` melalui **phpMyAdmin** (`http://localhost/phpmyadmin`).
