# GYA Pulse

Multi-tenant marketing analytics dashboard for GYA Media and its clients — Google Analytics (GA4), Google Ads, Search Console and Meta Ads in one branded, client-friendly view, with funnels & journeys as the flagship.

**This repo is the front-end mockup / design prototype** — every tab is wired with dummy data so the full experience is clickable. No backend or live API calls yet.

## Stack
- Vite + React
- ECharts (funnels, sankey, cohort heatmaps, lines, bars, donuts)
- react-google-charts (Google GeoChart map)
- Commissioner (brand font), GYA navy/blue/green palette

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Structure
- `src/data/nav.js` — two-level navigation (sources → sub-tabs)
- `src/data/content.js` — per-tab widget layout + dummy data
- `src/components/` — UI + chart widgets
- `src/lib/charts.js` — ECharts option builders (GYA theme)
