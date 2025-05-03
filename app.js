document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map', {
    worldCopyJump: true,
    minZoom: 2,
    maxZoom: 7,
    zoomControl: true,
    attributionControl: false
  }).setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 7,
    minZoom: 2
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
      issMarker.bindPopup(`International Space Station<br>${locationInfo}`).openPopup();
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
