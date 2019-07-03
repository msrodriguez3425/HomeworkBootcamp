// declare url to json
var earthquake_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';

//d3 to read the url
d3.json(earthquake_url, function(data) {
   createFeatures(data.features);
   console.log(data.features)
});

function createFeatures(earthquakeData) {
   //pop up displaying magnitude and date
   function onEachFeature(feature, layer) {
       layer.bindPopup('<h3>' + feature.properties.place +
           '</h3><hr><p> Magnitude:' + feature.properties.mag + '<hr> Date:' + new Date(feature.properties.time) + '</p>');
   }

   var earthquakes = L.geoJSON(earthquakeData, {
       onEachFeature: onEachFeature,
       pointToLayer: popplaces_marker
   });

   createMap(earthquakes);
}

function popplaces_marker(feature, latlng) {
    
    var magnitude = Math.round(feature.properties.mag);
    
    //color by magnitude
    switch (magnitude){
        case 4:
            var f_color = '#80ff00';
            break;
        case 5:
            var f_color = '#bfff00';
            break;
        case 6:
            var f_color = '	#ffff00';
            break;
        case 7:
            var f_color = '#ff8000  ';
            break;
        case 8:
            var f_color = '#ff4000';
            break;
        };

   return L.circleMarker(latlng, {
       radius: feature.properties.mag **2,
       fillColor: f_color,
       color: f_color,
       weight: 1.2,
       opacity: 1.0,
       fillOpacity: 0.6
   })
}

function createMap(earthquakes) {

   //tile layer
   var streetmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
       attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
       maxZoom: 11,
       id: 'mapbox.streets-basic',
       accessToken: API_KEY
   });

   var satmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
       attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
       maxZoom: 11,
       id: 'mapbox.satellite',
       accessToken: API_KEY
   });

   // baseMaps
   var baseMaps = {
        'Satellite Map': satmap,
        'Street Map': streetmap
       
   };

   var overlayMaps = {
       Earthquakes: earthquakes
   };

   var myMap = L.map('map', {
       center: [
           0, 120
       ],
       zoom: 5,
       layers: [streetmap, earthquakes]
   });

   L.control.layers(baseMaps, overlayMaps, {
       collapsed: false
   }).addTo(myMap);
}