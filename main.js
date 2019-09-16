let currLat = null;
let currLng = null;
let map = null;
let followMarker = true;

function init() {
  console.log('init');
  currLat =  document.getElementById('currLat');
  currLng = document.getElementById('currLng');

  // Rennes / Parc du Thabor : -1.669494 Lat 48.114384 Lng
  const parcThabor = {
    lat: 48.114384,
    lng: -1.669494,
  };

  const zoomLevel = 12;
  const accessToken = 'pk.eyJ1Ijoic2FtZnJvbWZyYW5jZSIsImEiOiJjazBoenNpM3owN2N5M2hxcG5vc2FsNm1mIn0.RqjLQuhXOEazL8PH7uKDbw';
  map = L.map('map').setView([parcThabor.lat, parcThabor.lng], zoomLevel);

  // const mainLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //   maxZoom: 18,
  //   id: 'mapbox.streets',
  //   accessToken
  // });
  const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
  
  mainLayer.addTo(map);
  // L.esri.basemapLayer('Streets').addTo(map);
  // L.esri.basemapLayer('Topographic').addTo(map);
  // L.esri.basemapLayer('Gray').addTo(map);
  // L.esri.basemapLayer('Gray').addTo(map);
  // L.esri.basemapLayer('DarkGray').addTo(map);
  // L.esri.basemapLayer('Imagery').addTo(map);
  // L.esri.basemapLayer('ImageryClarity').addTo(map);
  // L.esri.basemapLayer('ImageryFirefly').addTo(map);
  // L.esri.basemapLayer('ShadedRelief').addTo(map);
  // L.esri.basemapLayer('Physical').addTo(map);

  const options = { 
    lat: parcThabor.lat, 
    lng: parcThabor.lng, 
    title: 'Parc du Thabor', 
    draggable: true
  };

  addMarker(options, map);

  const gareRennes = { 
    lat: 48.1033, 
    lng: -1.6726 
  };

  const iconCustom = {
    lat: gareRennes.lat, 
    lng: gareRennes.lng, 
    title: 'Gare SNCF de Rennes', 
    draggable: false
  };

  addCustomMarker(iconCustom, map);
}

function addMarker(options, map) {
  const marker = L.marker([options.lat, options.lng], { title: options.title, draggable: options.draggable });
  marker.addTo(map);

  marker.on('dragend', function(event) {
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