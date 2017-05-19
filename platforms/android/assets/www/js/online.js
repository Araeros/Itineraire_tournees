const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibnByaXZhdCIsImEiOiJjajF5eWFpcWEwMDE2MndtdjN5NTdpbGFuIn0.kymcj7kptkG7Tw5-grrjzw';

function initmap(){
	
	map = L.map('map').setView([43.924, 2.1554], 13)
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		maxZoom: 19,
		id: 'mapbox.streets',
		accessToken: MAPBOX_ACCESS_TOKEN
	}).addTo(map);
	
	//Géolocalisation
	$("#myLocation").click(function (e) {
		currentLocation();
	});

	//Menu déroulant des tournées
	$("#myTruck1").click(function (e) {
		trajet = 1;
		truck();
	});
	$("#myTruck2").click(function (e) {
		trajet = 2;
		truck2();
	});
	$("#myTruck3").click(function (e) {
		trajet = 3;
		truck3();
	});
	$("#myTruck4").click(function (e) {
		trajet = 4;
		truck4();
	});
	$("#myTruck5").click(function (e) {
		trajet = 5;
		truck5();
	});
	$("#myTruck6").click(function (e) {
		trajet = 6;
		truck6();
	});
	$("#myTruck7").click(function (e) {
		trajet = 7;
		truck7();
	});
}	

//Ajout GeoJson Layers
function truck(){

	map.remove();

	map = L.map('map').setView([43.924, 2.1554], 13)
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		maxZoom: 19,
		id: 'mapbox.streets',
		accessToken: MAPBOX_ACCESS_TOKEN
	}).addTo(map);



	L.geoJSON(geojsonFeature,{	
		onEachFeature:onEachFeature,
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: new L.AwesomeNumberMarkers({
           	 		number: feature.properties.waypoint_index,
            		markerColor: "darkred"
       			})
			});
		}
	}).addTo(map);

	console.log(jsonFeatureTrip);
	L.geoJSON(jsonFeatureTrip.geometry, {
		style: {
			"color": "#8b0000"
		}
	}).addTo(map);
}

function truck2() {

	map.remove();

	map = L.map('map').setView([43.924, 2.1554], 13)
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		maxZoom: 19,
		id: 'mapbox.streets',
		accessToken: MAPBOX_ACCESS_TOKEN
	}).addTo(map);

	L.geoJSON(geojsonFeature1,{	
		onEachFeature:onEachFeature,
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: new L.AwesomeNumberMarkers({
           	 		number: feature.properties.waypoint_index,
            		markerColor: "blue"
       			})
			});
		}
	}).addTo(map);

	console.log(jsonFeatureTrip1);
	L.geoJSON(jsonFeatureTrip1.geometry, {
		style: {
			"color": "#91adf8"
		}
	}).addTo(map);
}

function truck3() {

	map.remove();

	map = L.map('map').setView([43.924, 2.1554], 13)
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		maxZoom: 19,
		id: 'mapbox.streets',
		accessToken: MAPBOX_ACCESS_TOKEN
	}).addTo(map);
}

function truck4() {

	map.remove();

	map = L.map('map').setView([43.924, 2.1554], 13)
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		maxZoom: 19,
		id: 'mapbox.streets',
		accessToken: MAPBOX_ACCESS_TOKEN
	}).addTo(map);
}

function truck5() {

	map.remove();

	map = L.map('map').setView([43.924, 2.1554], 13)
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		maxZoom: 19,
		id: 'mapbox.streets',
		accessToken: MAPBOX_ACCESS_TOKEN
	}).addTo(map);
}

function truck6() {

	map.remove();

	map = L.map('map').setView([43.924, 2.1554], 13)
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		maxZoom: 19,
		id: 'mapbox.streets',
		accessToken: MAPBOX_ACCESS_TOKEN
	}).addTo(map);
}

function truck7() {

	map.remove();

	map = L.map('map').setView([43.924, 2.1554], 13)
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		maxZoom: 19,
		id: 'mapbox.streets',
		accessToken: MAPBOX_ACCESS_TOKEN
	}).addTo(map);
}


//L.domUtils.create()

function onEachFeature(feature, layer) {
	layer.bindPopup(/*JSON.stringify(*/feature.properties.label/*)*/);
}

//Géolocalisation
function currentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((function (position) {
            var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
            marker.bindPopup("Ma position :<br> Latitude : " + position.coords.latitude + ',<br>Longitude ' + position.coords.longitude).openPopup();
			map.setView([position.coords.latitude, position.coords.longitude],17)
		}));
    } else {
        alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
}

