function initmap(){
	/*
	map = L.map('map').setView([43.924, 2.1554], 13);

	//layer = L.tileLayer.mbTiles('/storage/emulated/0/Download/map.mbtiles', {
	layer = L.tileLayer.mbTiles('img/map.mbtiles', {
		minZoom: 11,
		maxZoom: 15
	}).addTo(map);
	*/
	
	map = L.map('map').setView([43.924, 2.1554], 13);
		
	layer = L.tileLayer('img/Tiles/{z}/{x}/{y}.png', {
	//layer = L.tileLayer('/storage/emulated/0/Download/Tiles/{z}/{x}/{y}.png', {
		minZoom: 13,
		maxZoom: 13
	}).addTo(map);
	
	//Géolocalisation
	$("#myLocation").click(function (e) {
		currentLocation();
	});

	//Notification
	$("#myNotification").click(function (e) {
		//Emet le son chosi par défaut des notifications (paramètre = nombre de fois)
		navigator.notification.beep(1);
		navigator.vibrate(500);
		notify();
	});	
	
	//Telechargement
	$("#myDownload").click(function (e) {
		downloadFile();
	});
	
	//Decompresser une archive
	$("#myRefresh").click(function (e) {
		unZip();
		initMapUnziped();
	});
	
	//Menu déroulant des tournées
	$("#myTruck1").click(function (e) {
		trajet = 0;
		truck();
	});
	$("#myTruck2").click(function (e) {
		trajet = 1;
		truck2();
	});
	$("#myTruck3").click(function (e) {
		trajet = 2;
		truck();
	});
	$("#myTruck4").click(function (e) {
		trajet = 3;
		truck();
	});
	$("#myTruck5").click(function (e) {
		trajet = 4;
		truck();
	});
	$("#myTruck6").click(function (e) {
		trajet = 5;
		truck();
	});
	$("#myTruck7").click(function (e) {
		trajet = 6;
		truck();
	});
}	

//GeoJson Layers
function truck(){
	map.remove();

	map = L.map('map').setView([43.924, 2.1554], 13);
		
	layer = L.tileLayer('img/Tiles/{z}/{x}/{y}.png', {
	//layer = L.tileLayer('/storage/emulated/0/Download/Tiles/{z}/{x}/{y}.png', {
		minZoom: 13,
		maxZoom: 13
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

	console.log(jsonFeatureTrip0);
	L.geoJSON(jsonFeatureTrip0.geometry, {
		style: {
			"color": "#8b0000"
		}
	}).addTo(map);
}

function truck2(){

	map.remove();
	
	map = L.map('map').setView([43.924, 2.1554], 13);
		
	layer = L.tileLayer('img/Tiles/{z}/{x}/{y}.png', {
	//layer = L.tileLayer('/storage/emulated/0/Download/Tiles/{z}/{x}/{y}.png', {
		minZoom: 13,
		maxZoom: 13
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
		onEachFeature:onEachFeature,
	}).addTo(map);

	console.log(jsonFeatureTrip1);
	L.geoJSON(jsonFeatureTrip1.geometry, {
		style: {
			"color": "#4776f4"
		}
	}).addTo(map);
}

//Affichage propriété au clic sur le marqueur
function onEachFeature(feature, layer) {
	//JSON.stringify(whatYouWant)

    //let feature = addresses.features[address_index];

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
}

function addLine(string, line) {
    return string + '<br>' + line;
}



//Téléchargement (Supprime le fichier si déjà existant et le remplace)
function downloadFile(){
	try{
	document.addEventListener('deviceready', function () {
	
		fileTransfer = new FileTransfer();
		uri = encodeURI("http://cordova.apache.org/images/cordova_bot.png");
		fileURL = "file:///storage/sdcard1/Download/Test/cordova_bot.png";

		var options = new FileUploadOptions();
            options.chunkedMode=false;
            options.headers={
                Connection : "close"
            };
		
		fileTransfer.download(
			uri,
			fileURL,
			function(entry) {
				alert("Téléchargement réussi: " + entry.toURL());
				notifySuccess();
			},
			function(error) {
				alert("Erreur source" + error.source);
				alert("Erreur cible" + error.target);
				alert("Erreur code" + error.code);
				notifyError();
			},
			false,
			{
				headers: {
					"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
				}
			}
		);
		
	});
	}catch (e){
		alert("Fail :" + e);
	}
}


//Réinitialisation carte
function initMapUnziped(){

	map.off();
	map.remove();
	delete map;
	
	map = L.map('map').setView([43.924, 2.1554], 13);
	
	//Layer carte SD
	layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
	//Layer Mémoire interne
	//layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
		minZoom: 11,
		maxZoom: 18
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

	console.log(jsonFeatureTrip0);
	L.geoJSON(jsonFeatureTrip0.geometry, {
		style: {
			"color": "#8b0000"
		}
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


// Ebauche d'une fonction de suppression d'un répertoire
/*
function del() {

    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dir) {

        dir.getDirectory("11", {create: false}, function (directoryEntry) {
            directoryEntry.remove(function (directory) {
            	console.log('Suppresion réussie.');
                alert("Suppression réussie.");
            }, function () {
            	console.log("Echec suppresion : " + error.code)
                alert("Echec de la suppresion : " + error.code);
            }, function () {
                alert("Le fichier n'existe pas.");
            });
        });


    });

}
*/

//Décompression(prend 5-10 minutes : zoom 18 -> Il y a des milliers de png à charger)
function unZip() {
	//Ne dezip pas si les dossiers contenu dans le zip sont déjà présents dans le dossier de destination (= si dezip effectué auparavant)
	
	//Récupération sur la carte SD
	zip.unzip("/storage/sdcard1/Download/Tiles.zip","/storage/sdcard1/Download", function () {
		notifyZip();
	});
	
	//Récupération Mémoire interne
	/*
	zip.unzip("/storage/emulated/0/Download/Tiles.zip","/storage/emulated/0/Download", function () {
		alert('Archive Map décompressée');
	});
	*/
}

//Notification

function notifyZip() {
	
	document.addEventListener('deviceready', function () {

		cordova.plugins.notification.local.clearAll();	
		
		var date = new Date();

		cordova.plugins.notification.local.schedule({
			id: 1,
			title: "Offline Routing Notification",
			message: "Archive décompressée avec succès.",
			at: date,
		});

	});
}

function notifyError() {
	
	document.addEventListener('deviceready', function () {

		cordova.plugins.notification.local.clearAll();	
		
		var date = new Date();

		cordova.plugins.notification.local.schedule({
			id: 2,
			title: "Offline Routing Notification",
			message: "Téléchargement échoué.",
			at: date,
		});

	});
}

function notifySuccess() {
	
	document.addEventListener('deviceready', function () {

		cordova.plugins.notification.local.clearAll();	//efface les notifications actives (de cette application)
		
		var date = new Date();

		cordova.plugins.notification.local.schedule({
			id: 3,
			title: "Offline Routing Notification",
			message: "Téléchargement réussi.",
			at: date,
		});
	});
}

//Géolocalisation

function currentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((function (position) {
            var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
            marker.bindPopup("Ma position :<br> Latitude : " + position.coords.latitude + ',<br>Longitude ' + position.coords.longitude).openPopup();
			map.setView([position.coords.latitude, position.coords.longitude],17) //Centre la carte sur votre position actuelle
		}));
    } else {
        alert("La géolocalisation n'est pas supportée.");
    }
}


//Les plugins de cordova supportent en général mal les nouvelles permissions d'android 6.0 (Runtime permissions) il faut aller les accepter manuellement dans les paramètres
/*
//Permissions parcourir fichiers pour récupérer la carte dans le dossier Download -> Nécessaire à partir d'android 6.0.0
document.addEventListener('deviceready', () => {
	const permissions = cordova.plugins.permissions;
	checkRequest();
}	

function checkRequest(){
	permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function( status ){
		if ( status.hasPermission ) {
		}
		else {
			permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);
		}
	});
}

function error() {
  console.warn('WRITE_EXTERNAL_STORAGE n'est pas autorisé');
}

function success( status ) {
  if( !status.hasPermission ) error();
}
*/ 
