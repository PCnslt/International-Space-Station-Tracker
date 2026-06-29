<div align="center">

# 🛰️ ISS Live Tracker

### Real-time tracking of the International Space Station

[![Live Demo](https://img.shields.io/badge/🌍_Live_Demo-View_Site-22d3ee?style=for-the-badge)](https://pcnslt.github.io/International-Space-Station-Tracker/)
[![Pages Deploy](https://img.shields.io/github/actions/workflow/status/PCnslt/International-Space-Station-Tracker/static.yml?style=for-the-badge&label=Pages%20Deploy&color=3b82f6)](https://github.com/PCnslt/International-Space-Station-Tracker/actions)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222?style=flat-square&logo=github&logoColor=white)

</div>

---

## 🌍 Overview

A live, browser-based tracker that shows exactly where the **International Space Station** is right now. The ISS orbits ~420 km above Earth at ~28,000 km/h, circling the planet roughly **16 times a day** — this app plots that motion on an interactive map and refreshes the station's telemetry **every 2 seconds**.

**▶️ Live site:** https://pcnslt.github.io/International-Space-Station-Tracker/

## ✨ Features

- 🛰️ **Real-time position** on an interactive dark map, updated every 2 seconds
- 〰️ **Ground-track trail** tracing the station's recent path across the globe
- 📊 **Live telemetry** — latitude, longitude, altitude, velocity and footprint diameter
- ☀️ **Sunlight status** — whether the ISS is in daylight or Earth's shadow
- 🔄 **Derived orbital stats** — orbital period and orbits-per-day, computed on the fly
- 📍 **Reverse geocoding** — names the country or ocean the station is passing over
- 📱 **Responsive glassmorphism UI** that works on desktop and mobile

## 🛠️ How it works

This is a **100% static site** — just HTML, CSS and vanilla JavaScript, with no build step and no backend. Everything runs client-side, pulling from public APIs:

| Concern | Source |
| --- | --- |
| ISS position & telemetry | [`wheretheiss.at`](https://wheretheiss.at/w/developer) REST API |
| Map rendering | [Leaflet](https://leafletjs.com/) |
| Map tiles | CARTO basemaps + OpenStreetMap |
| Place names | OpenStreetMap [Nominatim](https://nominatim.org/) |

Orbital period and orbits-per-day aren't returned by the API — they're derived in JavaScript from the live altitude and velocity using the orbital circumference.

## 🚀 Deployment — GitHub Actions → GitHub Pages

The site is continuously deployed with **GitHub Actions**. On every push to `main`, a workflow packages the repository as a static artifact and publishes it straight to **GitHub Pages** — no manual steps, no FTP. The deploy badge above reflects the latest run.

```
push to main  ──▶  GitHub Actions  ──▶  upload static artifact  ──▶  deploy to GitHub Pages
```

## 💻 Run locally

No dependencies or build tools required:

```bash
git clone https://github.com/PCnslt/International-Space-Station-Tracker.git
cd International-Space-Station-Tracker

# open index.html directly, or serve it:
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 📁 Structure

```
├── index.html          # markup + page structure
├── style.css           # glassmorphism dark UI
├── app.js              # data fetching, map, live telemetry
└── .github/workflows/  # GitHub Actions → GitHub Pages deployment
```

---

<div align="center">
Built by <a href="https://github.com/PCnslt">Shawn R.</a> · Live data courtesy of <a href="https://wheretheiss.at">wheretheiss.at</a>
</div>
