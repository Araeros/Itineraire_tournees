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
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: new L.AwesomeNumberMarkers({
           	 		number: feature.properties.waypoint_index,
            		markerColor: "darkred"
       			})
			});
		},
		onEachFeature:onEachFeature
	}).addTo(map);

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
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: new L.AwesomeNumberMarkers({
           	 		number: feature.properties.waypoint_index,
            		markerColor: "blue"
       			})
			});
		},
		onEachFeature:onEachFeature
	}).addTo(map);

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
function addLine(string, line) {
    return string + '<br>' + line;
}


function onEachFeature(feature, layer) {
	//JSON.stringify(whatYouWant)

    let p = feature.properties;
    let popContent = p.label + (p.special != undefined ? ', ' + p.special : '');

    for (let b of p.beneficiaries) {
        let line = b.name;
        let isAnniversary = false;
        if (b.birthdate != null) {
       	    let now = new Date(Date.now());
            let birthdate = new Date(b.birthdate);
           	isAnniversary = now.getDate() == birthdate.getDate() && now.getMonth() == birthdate.getMonth();
         	// l'age de la personne en millisecondes
           	let age = now - birthdate;
        	let years = age / 31557600000
           	line += ', ' + Math.floor(years) + ' ans .';
        }
        line += ' - ' +b.address_additional + ' - ';
        popContent = addLine(popContent, line);
        if (isAnniversary) {
            popContent = addLine(popContent, '<img src="img/cake-with-2-candles-md.png">');
        }
    }
    layer.bindPopup(popContent);

    let div_popup = L.DomUtil.create('div');

            div_popup.innerHTML = '<p>' +
              "<font face='georgia'>Nom du terrain : </font>" + prop.nom + "<br>" +
              "<font face='georgia'>Terrain couvert : </font>" + ouiNon(prop.couvert) + "<br>" +
              "<font face='georgia'>Type de pÃ©tanque pratiquÃ©e : </font>" + typePetanque(prop.type_petanque) + "<br>" +
              "<font face='georgia'>CordonnÃ©es du terrain : </font>" + "<br>" + geo.coordinates[0] + " , " + geo.coordinates[1] + '</p>' +
              '<a class="deleteBoul" href="#"><i class="icon ion-trash-a" style="font-size:24px"></i></a>';
				
			$('a.deleteBoul', div_popup).on('click', function() {

              $.post('delBoulodrome', {
                  id: feature.id
                },
                function(data, textStatus, jqXHR) {
                  if (data == 'ok') {
                    console.log('deleted');
                    marker.remove();
                  }
                });

            });

            marker.bindPopup(div_popup);

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

