function initmap() {
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
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy <a href="http://mapbox.com">Mapbox</a>',
        minZoom: 13,
        maxZoom: 13
    }).addTo(map);

    //Géolocalisation
    $("#myLocation").click(function(e) {
        currentLocation();
    });
/*
    //Notification
    $("#myNotification").click(function(e) {
        //Emet le son chosi par défaut des notifications (paramètre = nombre de fois)
        navigator.notification.beep(1);
        // Vibre le temps choisi (paramètre = tmp en ms)
        navigator.vibrate(500);
    });
*/
    //Telechargement
    $("#myDownload").click(function(e) {
        downloadFile();
    });

    //Decompresser une archive
    $("#myRefresh").click(function(e) {
        unZip();
        initMapUnziped();
    });

    //Menu déroulant des tournées
    $("#myTruck1").click(function(e) {
        trajet = 0;
        truck0();
    });
    $("#myTruck2").click(function(e) {
        trajet = 1;
        truck1();
    });
    $("#myTruck3").click(function(e) {
        trajet = 2;
        truck2();
    });
    $("#myTruck4").click(function(e) {
        trajet = 3;
        truck3();
    });
    $("#myTruck5").click(function(e) {
        trajet = 4;
        truck4();
    });
    $("#myTruck6").click(function(e) {
        trajet = 5;
        truck5();
    });
    $("#reset").click(function(e) {
        reset();
    });
    $("#myRead").click(function(e) {
        read();
    });
}

//GeoJson Layers
function truck0() {
    map.remove();
    map = L.map('map').setView([43.924, 2.1554], 13);

    //Layer carte SD
    //layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
        //Layer Mémoire interne
    layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);

    alert(JSON.stringify(geojsonFeature0,null,2));

    L.geoJSON(geojsonFeature0, {

        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: new L.AwesomeNumberMarkers({
                    number: feature.properties.waypoint_index,
                    markerColor: "darkred"
                })
            });
        },
        onEachFeature: onEachFeature

    }).addTo(map);

    console.log(jsonFeatureTrip0);
    L.geoJSON(jsonFeatureTrip0.geometry, {
        style: {
            "color": "#8b0000"
        }
    }).addTo(map);

    console.log(cordova.file.applicationDirectory);	
	window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
		console.dir(f);
	}, fail);

	//This alias is a read-only pointer to the app itself
	window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/res/tourAddresses0", gotFile, fail);

}

function truck1() {

    map.remove();

    map = L.map('map').setView([43.924, 2.1554], 13);

    //Layer carte SD
    //layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
        //Layer Mémoire interne
    layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);

    L.geoJSON(geojsonFeature1, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: new L.AwesomeNumberMarkers({
                    number: feature.properties.waypoint_index,
                    markerColor: "blue"
                })
            });
        },
        onEachFeature: onEachFeature,
    }).addTo(map);

    console.log(jsonFeatureTrip1);
    L.geoJSON(jsonFeatureTrip1.geometry, {
        style: {
            "color": "#4776f4"
        }
    }).addTo(map);
}

function truck2() {
    map.remove();

    map = L.map('map').setView([43.924, 2.1554], 13);

    //Layer carte SD
    //layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
        //Layer Mémoire interne
    layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);

    L.geoJSON(geojsonFeature2, {

        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: new L.AwesomeNumberMarkers({
                    number: feature.properties.waypoint_index,
                    markerColor: "darkgreen"
                })
            });
        },
        onEachFeature: onEachFeature

    }).addTo(map);

    console.log(jsonFeatureTrip2);
    L.geoJSON(jsonFeatureTrip2.geometry, {
        style: {
            "color": "#006400"
        }
    }).addTo(map);
}

function truck3() {
    map.remove();

    map = L.map('map').setView([43.924, 2.1554], 13);

    //Layer carte SD
    //layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
        //Layer Mémoire interne
    layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);

    L.geoJSON(geojsonFeature3, {

        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: new L.AwesomeNumberMarkers({
                    number: feature.properties.waypoint_index,
                    markerColor: "orange"
                })
            });
        },
        onEachFeature: onEachFeature

    }).addTo(map);

    console.log(jsonFeatureTrip3);
    L.geoJSON(jsonFeatureTrip3.geometry, {
        style: {
            "color": "#fc9303"
        }
    }).addTo(map);
}

function truck4() {
    map.remove();

    map = L.map('map').setView([43.924, 2.1554], 13);

    //Layer carte SD
    //layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
        //Layer Mémoire interne
    layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);

    L.geoJSON(geojsonFeature4, {

        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: new L.AwesomeNumberMarkers({
                    number: feature.properties.waypoint_index,
                    markerColor: "black"
                })
            });
        },
        onEachFeature: onEachFeature

    }).addTo(map);

    console.log(jsonFeatureTrip4);
    L.geoJSON(jsonFeatureTrip4.geometry, {
        style: {
            "color": "#000000"
        }
    }).addTo(map);
}

function truck5() {
    map.remove();

    map = L.map('map').setView([43.924, 2.1554], 13);

    //Layer carte SD
    //layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
        //Layer Mémoire interne
    layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);

    L.geoJSON(geojsonFeature5, {

        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: new L.AwesomeNumberMarkers({
                    number: feature.properties.waypoint_index,
                    markerColor: "purple"
                })
            });
        },
        onEachFeature: onEachFeature

    }).addTo(map);

    console.log(jsonFeatureTrip5);
    L.geoJSON(jsonFeatureTrip5.geometry, {
        style: {
            "color": "#5a005a"
        }
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
        if (b.address_additional) {
            line = b.address_additional + ' - ' + line;
        }
        popContent = addLine(popContent, line);
        if (isAnniversary) {
            popContent = addLine(popContent, '<img src="img/cake-with-2-candles-md.png">');
        }
    }
    if (feature.properties.note) {
        var label = '<u>Note :</u>'
        popContent = addLine(popContent, label);
        popContent = addLine(popContent, feature.properties.note);
    }

    let div_popup = L.DomUtil.create('div');

    div_popup.innerHTML = '<ul><li id="inline"><a href="#" class="check"><img src="img/check.png"></a></li>' +
        '<li id="inline"><a href="#" class="cancel"><img src="img/cancel.png"></a></li>' +
        '<li id="inline"><a href="#" class="form"><img src="img/form.png"></a></li></ul>' +
        '<input id="msg">' +
        '<p id="retour"></p>';

    div_popup.innerHTML = addLine(popContent, div_popup.innerHTML);
    layer.bindPopup(div_popup);
    //si marker coloré -> vert
    $('a.check', div_popup).on('click', function() {
        layer.setIcon(new L.AwesomeNumberMarkers({
            number: feature.properties.waypoint_index,
            markerColor: "green"
        }));
    });
    //si marker vert -> coloré
    $('a.cancel', div_popup).on('click', function() {
        layer.setIcon(new L.AwesomeNumberMarkers({
            number: feature.properties.waypoint_index,
            markerColor: "darkred"
        }));
    });
    //Ecriture dans un fichier (Fonctionel !)
    $('a.form', div_popup).on('click', function() {
    var x;
    	x=form(x);
    	console.log(x);
        document.addEventListener('deviceready', function() {
            var Fichier = "log.txt";
            var Texte = "Problème rencontré à l'adresse : "+feature.properties.label+" --> "+x;

            fail = function(e) { alert(JSON.stringify(e)); }
            gotFileWriter = function(writer) { writer.write(Texte); };
            gotFileEntry = function(fileEntry) { fileEntry.createWriter(gotFileWriter, fail); };
            gotFS = function(fileSystem) { fileSystem.root.getFile(Fichier, { create: true }, gotFileEntry, fail); };
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        });
    });
}


//Lecture d'un fichier
function read() {

    document.addEventListener('deviceready', function() {

	    console.log(cordova.file.applicationDirectory);	
		window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
			console.dir(f);
		}, fail);

		//This alias is a read-only pointer to the app itself
		window.resolveLocalFileSystemURL("file:///storage/emulated/0/Download/tourAddresses0.js", gotFile, fail);
	});
}

function fail(e) {
	console.log("FileSystem Error");
	console.dir(e);
}

function gotFile(fileEntry) {

	fileEntry.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			console.log(this.result);
			geojsonFeature0=JSON.parse(this.result);
			alert(JSON.stringify(geojsonFeature0,null,2));
			//document.querySelector("#readFile").innerHTML = this.result;
		}

		reader.readAsText(file);
	});

}


//Formulaire de gestion des erreurs sur les markers
function form(varX) {
    var text;

    // recupère la valeur de l'input id="msg"
    varX = document.getElementById("msg").value;
    if (varX) {
        text = "Message '" + varX + "' enregistré !";
    } else {
        text = "Message enregistré !";
    }
    document.getElementById("retour").innerHTML = text;

    return varX;
}

//Téléchargement (Supprime le fichier si déjà existant et le remplace)
function downloadFile() {
    try {
        document.addEventListener('deviceready', function() {

            fileTransfer = new FileTransfer();
            uri = encodeURI("http://10.1.0.205:9226/downloadAddresses?num=0");
            //DL sur la carte SD
            //fileURL = "file:///storage/sdcard1/Download/Test/cordova_bot.png";
            //DL sur la mémoire interne
            fileURL = "file:///storage/emulated/0/Download/tourAddresses0.js";

            var options = new FileUploadOptions();
            options.chunkedMode = false;
            options.headers = {
                Connection: "close"
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
                false, {
                    headers: {
                        "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                    }
                }
            );

        });
    } catch (e) {
        alert("Fail :" + e);
    }
}


//Réinitialisation carte
function initMapUnziped() {

    map.off();
    map.remove();

    map = L.map('map').setView([43.924, 2.1554], 13);

    //Layer carte SD
    //layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
        //Layer Mémoire interne
    layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);

    L.geoJSON(geojsonFeature, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
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

    L.geoJSON(geojsonFeature1, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
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

        dir.getDirectory("Test", {create: false}, function (directoryEntry) {
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
/*
    //Récupération sur la carte SD
    zip.unzip("/storage/sdcard1/Download/Tiles.zip", "/storage/sdcard1/Download", function() {
        notifyZip();
    });
*/
    //Récupération Mémoire interne
    
    zip.unzip("/storage/emulated/0/Download/Tiles.zip","/storage/emulated/0/Download", function () {
    	notifyZip();
    });
    
}

//Notification

function notifyZip() {

    document.addEventListener('deviceready', function() {

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

    document.addEventListener('deviceready', function() {

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

    document.addEventListener('deviceready', function() {

        cordova.plugins.notification.local.clearAll(); //efface les notifications actives (de cette application)

        var date = new Date();

        cordova.plugins.notification.local.schedule({
            id: 3,
            title: "Offline Routing Notification",
            message: "Téléchargement réussi.",
            at: date,
        });
    });
}

//réinitilisa la carte à son état d'origine
function reset() {
    map.off();
    map.remove();

    map = L.map('map').setView([43.924, 2.1554], 13);

    //Layer carte SD
    //layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
        //Layer Mémoire interne
    layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);
}


//Géolocalisation
function currentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((function(position) {
            var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
            marker.bindPopup("Ma position :<br> Latitude : " + position.coords.latitude + ',<br>Longitude ' + position.coords.longitude).openPopup();
            map.setView([position.coords.latitude, position.coords.longitude], 17) //Centre la carte sur votre position actuelle
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
