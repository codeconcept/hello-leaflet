let currLat = null;
let currLng = null;
let map = null;
let followMarker = true;
let circle = null;
let circleRange = null;
let btnFindAdress = null
let address = null;
let coords = {};
let chkEnableMapCLick = null

function init() {
  currLat =  document.getElementById('currLat');
  currLng = document.getElementById('currLng');
  circleRange = document.getElementById('circleRange');
  btnFindAdress = document.getElementById('btnFindAdress');
  btnFindAdress.addEventListener('click', findAddressByCoords);
  address = document.getElementById('address');
  chkEnableMapCLick = document.getElementById('chkEnableMapCLick');
  chkEnableMapCLick.addEventListener('change', toggleMapListening);
  
  // Rennes / Parc du Thabor : -1.669494 Lat 48.114384 Lng
  const parcThabor = {
    lat: 48.114384,
    lng: -1.669494,
  };
  
  const zoomLevel = 13;
  const accessToken = 'pk.eyJ1Ijoic2FtZnJvbWZyYW5jZSIsImEiOiJjazBoenNpM3owN2N5M2hxcG5vc2FsNm1mIn0.RqjLQuhXOEazL8PH7uKDbw';
  map = L.map('map').setView([parcThabor.lat, parcThabor.lng], zoomLevel);
  
  const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  
  mainLayer.addTo(map);
  initMarkers(parcThabor);
}

function initMarkers(parcThabor) {
  const parcThaborOptions = {
    lat: parcThabor.lat,
    lng: parcThabor.lng,
    title: 'Parc du Thabor',
    draggable: true
  };
  addMarker(parcThaborOptions, map);
  const gareRennes = {
    lat: 48.1033,
    lng: -1.6726,
    circle: {
      color: 'green',
      fillColor: '#42f5b0',
      fillOpacity: 0.5,
      radius: 500
    }
  };
  initCustomMarker(gareRennes);
  initCircle(gareRennes);
}

function initCustomMarker(gareRennes) {
  const iconCustom = {
    lat: gareRennes.lat,
    lng: gareRennes.lng,
    title: 'Gare SNCF de Rennes',
    draggable: false
  };
  addCustomMarker(iconCustom, map);
}

function initCircle(gareRennes) {
  addCircle(gareRennes, map);
  circleRange.addEventListener('change', (event) => {
    console.log(event.target.value);
    console.log('radius', circle.getRadius());
    circle.setRadius(event.target.value * 120);
  });
}

function addMarker(options, map) {
  const marker = L.marker([options.lat, options.lng], { title: options.title, draggable: options.draggable });
  marker.addTo(map);

  marker.on('dragend', function(event) {
    btnFindAdress.disabled = false;
    address.innerText = '';
    coords = event.target._latlng;
    showNewCoords(event.target._latlng, event.target);
    if (followMarker) {
      map.setView(event.target._latlng);
    }
  });
}

function addCustomMarker(options, map) {
  const greenIcon = L.icon({
	iconUrl: './icons/smiley_happy.png',
    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 18], // point of the icon which will correspond to marker's location
    popupAnchor:  [1, -9] // point from which the popup should open relative to the iconAnchor
  });

  const marker = L.marker([options.lat, options.lng], { icon: greenIcon, title: options.title });
  marker
    .addTo(map)
    .bindPopup('en voiture SVP');
}

function showNewCoords(coords, marker) {
  currLat.innerText = `lat: ${coords.lat}`;
  currLng.innerText = `lng: ${coords.lng}`;
  marker
    .bindPopup(`lat: ${coords.lat} - lng: ${coords.lng}`)
    .openPopup();
}

function addCircle(options, map) {
  circle = L.circle([options.lat, options.lng], {
    color: options.circle.color,
    fillColor: options.circle.fillColor,
    fillOpacity: options.circle.fillOpacity,
    radius: options.circle.radius
  });
  circle.addTo(map);
}

function findAddressByCoords() {
  if(!coords) {
    return;
  }
  const geocodeService = L.esri.Geocoding.geocodeService();
  geocodeService.reverse().latlng(coords).run(function (error, result) {
    if (error) {
      return;
    }
    address.innerText = result.address.Match_addr;
  });
}

function toggleMapListening(event) {
  console.log('change', event.target.checked);
  if (event.target.checked) {
    map.on('click', toggleAddMarkerAndReverseGeocode);
  } else {
    map.off('click', toggleAddMarkerAndReverseGeocode);
  }
}

function toggleAddMarkerAndReverseGeocode(event) {
  const geocodeService = L.esri.Geocoding.geocodeService();
  geocodeService.reverse().latlng(event.latlng).run(function (error, result) {
    if (error) {
      return;
    }
    L.marker(result.latlng).addTo(map).bindPopup(result.address.Match_addr);
  });
}
