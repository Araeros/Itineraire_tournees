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
		truck();
	});
	$("#myTruck2").click(function (e) {
		truck2();
	});
	$("#myTruck3").click(function (e) {
		truck3();
	});
	$("#myTruck4").click(function (e) {
		truck4();
	});
	$("#myTruck5").click(function (e) {
		truck5();
	});
	$("#myTruck6").click(function (e) {
		truck6();
	});
	$("#myTruck7").click(function (e) {
		truck7();
	});
	$("#reset").click(function (e) {
		reset();
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

    let div_popup = L.DomUtil.create('div');

            div_popup.innerHTML ='<ul><li id="inline"><a href="#" class="check"><img src="img/check.png"></a></li>' +
            					'<li id="inline"><a href="#" class="cancel"><img src="img/cancel.png"></a></li>' +
            					'<li id="inline"><a href="#" class="read"><img src="img/truck.png"></a></li>' +
            					'<li id="inline"><a href="#" class="form"><img src="img/form.png"></a></li></ul>';

    div_popup.innerHTML = addLine(popContent,div_popup.innerHTML);
    layer.bindPopup(div_popup);
    //si marker coloré -> vert
    $('a.check', div_popup).on('click', function() {
		layer.setIcon(new L.AwesomeNumberMarkers({
         	number: feature.properties.waypoint_index,
          	markerColor: "green"
       	}));
    });
    //si marker vert -> coloré
	$('a.cancel', div_popup).on('click',function () {
        layer.setIcon(new L.AwesomeNumberMarkers({
           	number: feature.properties.waypoint_index,
            markerColor: "darkred"
       	}));
    });
	//Ecriture dans un fichier (res/log.txt)
    $('a.form', div_popup).on('click',function () {
    	Fichier = "log.txt";
		Texte   = "Ceci est un test !"

		fail          = function (e         )  { alert(JSON.stringify(e));  }
		gotFileWriter = function (writer    )  {  writer.write(Email); };
		gotFileEntry  = function (fileEntry )  { fileEntry.createWriter(gotFileWriter, fail); };
		gotFS         = function (fileSystem)  { fileSystem.root.getFile(Fichier, {create: true, exclusive: false}, gotFileEntry, fail); };
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);   
		alert(LocalFileSystem); 	
    });
    //Lecture dans un fichier
    $('a.read', div_popup).on('click',function () {
   		Fichier = "log.txt" ;
		gotFileReader  = function (file    )    { 
			reader=new FileReader(); reader.onloadend =function(e){  
			//On récupère ici le contenu du fichier
         	   ContenuDuFichier = e.target._result;

       		};  reader.readAsText(file);  
   		};
		fail           = function (e        )  { alert(JSON.stringify(e)); }
		gotFileEntry  = function (fileEntry )  { fileEntry.file(gotFileReader, fail); }
		gotFS         = function (fileSystem)  { fileSystem.root.getFile(Fichier, null, gotFileEntry, fail); }
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
	});
}
       
//réinitilisa la carte à son état d'origine
function reset(){
	map.off();
	map.remove();
	
	map = L.map('map').setView([43.924, 2.1554], 13)
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		maxZoom: 19,
		id: 'mapbox.streets',
		accessToken: MAPBOX_ACCESS_TOKEN
	}).addTo(map);
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

