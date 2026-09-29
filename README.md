# 📋 A3dad — إعداد خدام

**React · TypeScript · QR Scanning · Local Storage**

A QR-based checklist application for recording servant preparation and spiritual activity checks.

## ✨ Feature reel

- Scan a QR code with the device camera.
- Record checks for liturgy, communion, confession, tools, prayer, and fasting.
- Reopen the saved checklist when the same QR code is scanned.
- View stored entries in a dashboard.
- Export UTF-8 CSV data for use in Excel.

## 🚀 Getting started

Use Node.js 22.12 or later and npm.

```bash
git clone https://github.com/Marcomagdy908/a3dad.git
cd a3dad
npm install
npm run dev
```

Open the local URL printed by Vite. To create and inspect a production build:

```bash
npm run build
npm run preview
```

## 🎯 How to use

1. Open the **Scan** page and allow camera access.
2. Scan a member's QR code.
3. Update the checklist; changes are saved locally.
4. Open the dashboard to review entries or export them.

Scanning requires localhost or HTTPS. The dashboard's “Export to Excel” action downloads a CSV file rather than an XLSX workbook.

## 🗂️ Project map

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Dashboard and scanner routes |
| `src/scan.tsx` | QR camera scanning and checklist editing |
| `src/dashboard.tsx` | Review, CSV export, and clearing local entries |
| `src/navbar.tsx` | Navigation |

## 💾 Storage

Entries use `data/<qr-code>` keys in browser local storage. Data stays on that browser and is not synchronized across devices. Export records before clearing application data.

## 🧪 Checks

```bash
npm run lint
npm run build
```


---

[Marco Magdy](https://github.com/Marcomagdy908) · [More projects](https://github.com/Marcomagdy908?tab=repositories)
