document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map', {
    worldCopyJump: false,
    minZoom: 2,
    maxZoom: 2,
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false
  }).setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 2,
    minZoom: 2,
    noWrap: true
  }).addTo(map);

  function addGridLines() {
    for (let lat = -80; lat <= 80; lat += 20) {
      L.polyline([[lat, -180], [lat, 180]], { color: '#888', weight: 1, opacity: 0.5, interactive: false }).addTo(map);
    }
    for (let lng = -180; lng <= 180; lng += 20) {
      L.polyline([[-80, lng], [80, lng]], { color: '#888', weight: 1, opacity: 0.5, interactive: false }).addTo(map);
    }
  }
  addGridLines();

  const issIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
    iconSize: [40, 24],
    iconAnchor: [20, 12]
  });
  const issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
  async function fetchLocation(lat, lng) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const locationData = await res.json();
      let locationInfo = locationData.display_name || 'Location not found';
      if (locationInfo === 'Location not found' && lat < 60 && lat > -60) {
        locationInfo = 'Over the Ocean';
      }
    issMarker.bindPopup(`
      <div class="custom-popup">
        <h3 style="margin:0 0 12px 0; display:flex; align-items:center; gap:8px; color:#58a6ff;">
          <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"/>
          </svg>
          ISS Current Position
        </h3>
        <div style="padding:8px 0; border-top:1px solid rgba(255,255,255,0.1);">
          <div style="display:flex; align-items:center; gap:8px; padding:8px 0;">
            <svg style="width:20px;height:20px;opacity:0.8;" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 20a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m0-18a10 10 0 0 0-10 10a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 10a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 12 9a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 12 12Z"/>
            </svg>
            ${locationInfo}
          </div>
        </div>
      </div>
    `, { autoClose: true, closeOnClick: true });
    } catch (err) {
      console.error('Error fetching location data:', err);
    }
  }

  issMarker.on('click', () => {
    const { lat, lng } = issMarker.getLatLng();
    fetchLocation(lat, lng);
  });

  const latEl = document.getElementById('iss-lat');
  const lngEl = document.getElementById('iss-lng');
  const timeEl = document.getElementById('last-updated');

  async function updateIss() {
    try {
      const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      const data = await res.json();
      console.log('API Response:', data);
      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);

      console.log('Latitude:', lat, 'Longitude:', lng);
    issMarker.setLatLng([lat, lng]);
    
    // Update popup with latest position data
    fetchLocation(lat, lng);

    latEl.textContent = lat.toFixed(4);
    lngEl.textContent = lng.toFixed(4);
    timeEl.textContent = new Date(data.timestamp * 1000).toLocaleTimeString();
    } catch (err) {
      console.error('Error fetching ISS data:', err);
    }
  }

  updateIss();
  setInterval(updateIss, 2000);
});
