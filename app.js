document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map', {
    worldCopyJump: true,
    minZoom: 2,
    maxZoom: 6,
    zoomControl: false,
    attributionControl: false
  }).setView([20, 0], 3);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 6
  }).addTo(map);

  const issIcon = L.divIcon({
    className: 'iss-marker',
    html: '<span class="iss-ring"></span><span class="iss-emoji">🛰️</span>',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
  const issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

  const trailPts = [];
  const trail = L.polyline([], { color: '#22d3ee', weight: 2, opacity: 0.55 }).addTo(map);

  let follow = true;
  map.on('dragstart', () => { follow = false; });
  document.getElementById('recenter').addEventListener('click', () => {
    follow = true;
    map.panTo(issMarker.getLatLng(), { animate: true });
  });

  const live = document.getElementById('live');
  const $ = id => document.getElementById(id);
  function set(id, val) {
    const el = $(id);
    if (!el || el.textContent === String(val)) return;
    el.textContent = val;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }

  const hemiLat = v => Math.abs(v).toFixed(2) + '° ' + (v >= 0 ? 'N' : 'S');
  const hemiLng = v => Math.abs(v).toFixed(2) + '° ' + (v >= 0 ? 'E' : 'W');
  const fmt = n => Math.round(n).toLocaleString('en-US');

  let lastGeo = 0;
  async function reverseGeocode(lat, lng) {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=3&lat=${lat}&lon=${lng}`);
      const d = await r.json();
      set('iss-location', d.display_name || 'Over open ocean 🌊');
    } catch (e) { /* keep previous reading */ }
  }

  async function update() {
    try {
      const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      const d = await res.json();
      const lat = d.latitude, lng = d.longitude, ll = [lat, lng];

      issMarker.setLatLng(ll);
      trailPts.push(ll);
      if (trailPts.length > 90) trailPts.shift();
      trail.setLatLngs(trailPts);
      if (follow) map.panTo(ll, { animate: true, duration: 1 });

      set('iss-lat', hemiLat(lat));
      set('iss-lng', hemiLng(lng));
      set('iss-alt', fmt(d.altitude) + ' km');
      set('iss-vel', fmt(d.velocity) + ' km/h');
      set('iss-foot', fmt(d.footprint) + ' km');
      set('iss-sun', d.visibility === 'daylight' ? '☀️ Sunlit' : '🌑 In shadow');

      const radius = 6371 + d.altitude;
      const periodMin = (2 * Math.PI * radius) / d.velocity * 60;
      set('iss-period', periodMin.toFixed(1) + ' min');
      set('iss-orbits', (1440 / periodMin).toFixed(1));

      set('last-updated', new Date(d.timestamp * 1000).toLocaleTimeString());
      live.classList.remove('stale');

      const now = Date.now();
      if (now - lastGeo > 12000) { lastGeo = now; reverseGeocode(lat, lng); }
    } catch (e) {
      console.error('Error fetching ISS data:', e);
      live.classList.add('stale');
    }
  }

  update();
  setInterval(update, 2000);

  const aboutBtn = $('aboutBtn'), about = $('about');
  aboutBtn.addEventListener('click', () => {
    if (about.hasAttribute('hidden')) {
      about.removeAttribute('hidden');
      aboutBtn.classList.add('open');
    } else {
      about.setAttribute('hidden', '');
      aboutBtn.classList.remove('open');
    }
  });
});
