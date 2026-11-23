# Palengke mo, Keri ko — Offline Demo

One app with **Customer**, **Vendor**, and **LGU Admin** portals. No backend and no sign-in.

## Why this repo

The split customer / vendor / LGU frontends need a live Strapi API. This demo keeps the full click-through on **GitHub Pages** using local seed data and `localStorage`.

## What persists

Orders, payments, chat threads/messages, cart, catalog edits, vendor assignments, feedback, and the customer profile stay in the browser (`paranaque-demo-v1-*`). Use **Reset demo** in the top banner to wipe them.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5176 — starts on the customer storefront. Switch portals from the header/sidebar.

## Build for GitHub Pages

```bash
$env:VITE_BASE_PATH="/paranaque-palengke-demo/"
npm run build
```

## Note

This is a showcase / thesis demo only. Production work stays in the API-wired repos (`paranaque-palengke`, `-vendor`, `-lgu`) plus the Strapi backend.
