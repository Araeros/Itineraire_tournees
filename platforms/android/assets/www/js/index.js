let server = 'http://10.1.0.205:9226';
let tpsInit = 10; // Initialisation de l'appli (compter nb tournée/dezip/initMap) après X ms.
let tpsGeoloc = 2000; //Temps entre chaques géolocalisations
let tpsCheckConnection = 10000; //temps entre chaques vérifications de la connexion 
let tpsVerifTournees = 10001; // temps de vérifs entre chaques demandes du nb de tournées au serveur
let tpsNotif = 5000; // Temps entre chaques vérification du contenu du fichier pour gérer les notifications
let tpsEnvoi = 30000; //Teps entres chaques envoie du contenu du fichier au serveur si il y a du contenu
let layer; //Layer des tuiles de la carte
let map; //Objet map
let trajet; //compteur de trajets
let geojsonFeature = new Object(); //objet JSON des adresses
let jsonFeatureTrip = new Object(); //Objet JSON des trajets
let etatInternet; //Etat de la connexion internet (Inconnue, Wifi, 3G, Hors connexion, ect ..)
let initialisation = 0; // Initialisation de la carte (offline = chargée sans connexion/ online = chargée sous couverture)

function initmap() {
    /*
    map = L.map('map').setView([43.924, 2.1554], 13);

    //layer = L.tileLayer.mbTiles('/storage/emulated/0/Download/map.mbtiles', {
    layer = L.tileLayer.mbTiles('img/map.mbtiles', {
    	minZoom: 11,
    	maxZoom: 15
    }).addTo(map);
    */
    checkConnection();
    map = L.map('map').setView([43.924, 2.1554], 13);

    layer = L.tileLayer('img/Tiles/{z}/{x}/{y}.png', {
        //layer = L.tileLayer('/storage/emulated/0/Download/Tiles/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy <a href="http://mapbox.com">Mapbox</a>',
        minZoom: 13,
        maxZoom: 13
    }).addTo(map);

    /*
    	//Notification
    	$("#myNotification").click(function(e) {
    		//Emet le son chosi par défaut des notifications (paramètre = nombre de fois)
    		navigator.notification.beep(1);
    		// Vibre le temps choisi (paramètre = tmp en ms)
    		navigator.vibrate(500);
    	});
    */

    //Télécharger nouvelle map
    $("#myDownload").click(function(e) {
        if (etatInternet == 'No network connection') {
            alert('Aucune connection détectée');
        } else {
            alert('Télécharger la nouvelle map !');
            //Télécharger la nouvelle map
        }
    });

    $("#sendLogs").click(function(e) {
        uploadFile();
    });

    $("#myAsk").click(function(e) {
        help();
    });

//    setTimeout(function() { initAppli(); }, tpsInit);

    setInterval(function() { currentLocation(); }, tpsGeoloc);

//    setInterval(function() { checkConnection(); }, tpsCheckConnection);

/*    setInterval(function() {
        if (initialisation == 'offline') {
            if (etatInternet != 'No network connection') {
                getTour();
                chargementTournees = 'effectué';
            }
        }
    }, tpsVerifTournees);

    setInterval(function() {
        checkFileNotif();
    }, tpsNotif);

    setInterval(function() {
        checkFileEnvoi();
    }, tpsEnvoi);
*/
}

//Fonction d'aide
function help() {
    alert(" - Le premier bouton de l'application est le bouton d'envoi de logs.\n" +
        " - Le deuxième bouton permet d'afficher la liste de trajets pour sélectionner et télécharger la tournée voulue.\n" +
        " - Lorsque l'application n'a pas d'accès à internet il est impossible de télécharger un nouveau trajet.\n");
}

//Initialisation de l'application
function initAppli() {
    if (etatInternet == 'No network connection') {
        unZip();
        initMapUnziped();
        initialisation = 'offline';
        alert('Map Initialisée, nécessite une connexion pour charger les tournées');
    } else {
        getTour();
        unZip();
        initMapUnziped();
        initialisation = 'online';
        alert('Map initialisée, tournées chargées');
    }
}


//Vérifie si il y a du contenu dans le fichier 'log.txt'
function checkFileNotif() {

    document.addEventListener('deviceready', function() {

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
            console.dir(f);
        }, failReadCheckNotif);

        //This alias is a read-only pointer to the app itself
        window.resolveLocalFileSystemURL("file:///storage/emulated/0/log.txt", gotFileCheckNotif, failReadCheckNotif);
    });


    function gotFileCheckNotif(fileEntry) {
        fileEntry.file(function(file) {
            reader = new FileReader();

            reader.onloadend = function(e) {
                console.log(this.result);
                var checkLog = JSON.parse(this.result);
                if (JSON.stringify(checkLog) != '{}') {
                    document.getElementById("notif").className = 'icon icon-menu ion-paper-airplane icon-notif';
                } else {
                    document.getElementById("notif").className = 'icon icon-menu ion-paper-airplane';
                }
            }
            reader.readAsText(file);
        });


    }

    function failReadCheckNotif(e) {
        alert("FileSystem Error");
        alert(JSON.stringify(e, null, 2));
    }
}

//Vérifie si il y a du contenu dans le fichier 'log.txt'
function checkFileEnvoi() {

    document.addEventListener('deviceready', function() {

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
            console.dir(f);
        }, failReadCheckEnvoi);

        //This alias is a read-only pointer to the app itself
        window.resolveLocalFileSystemURL("file:///storage/emulated/0/log.txt", gotFileCheckEnvoi, failReadCheckEnvoi);
    });


    function gotFileCheckEnvoi(fileEntry) {
        fileEntry.file(function(file) {
            reader = new FileReader();

            reader.onloadend = function(e) {
                console.log(this.result);
                var checkLog = JSON.parse(this.result);
                if (JSON.stringify(checkLog) != '{}') {
                    if (etatInternet != 'No network connection') {
                        uploadFile();
                    }

                }

            }
            reader.readAsText(file);
        });


    }

    function failReadCheckEnvoi(e) {
        alert("FileSystem Error");
        alert(JSON.stringify(e, null, 2));
    }
}

//Envoyer un fichier au serveur
function uploadFile() {

    document.addEventListener('deviceready', function() {
        cordovaHTTP.uploadFile(server + "/tabletLogsUpload", {
            username: 'rout-ine',
            password: 'extranetrout-ine81'

        }, { Authorization: "OAuth2: token" }, "file:///storage/emulated/0/log.txt", "file", function(response) {
            //alert('Statut: ' + response.status);
            //alert('Message: ' + response.data);
            clearLog();
        }, function(response) {
            alert('Statut: ' + response.status);
            alert('Erreur: ' + response.error);
            alert('Message: ' + response.data);
        });
    });

    document.getElementById("notif").className = 'icon icon-menu ion-paper-airplane';

}


//Lire le fichier de log
function readLog(callback) {
    document.addEventListener('deviceready', function() {

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
            console.dir(f);
        }, failReadLog);

        //This alias is a read-only pointer to the app itself
        window.resolveLocalFileSystemURL("file:///storage/emulated/0/log.txt", gotFileLog, failReadLog);
    });


    function gotFileLog(fileEntry) {
        fileEntry.file(function(file) {
            reader = new FileReader();

            reader.onloadend = function(e) {
                console.log(this.result);
                logFile = JSON.parse(this.result);
                alert(JSON.stringify(logFile, null, 2));
                callback();
                //document.querySelector("#readFile").innerHTML = this.result;
            }
            reader.readAsText(file);
        });
    }

}

function failReadLog(e) {
    alert("Erreur de lecture: Création d'un fichier log.txt");
    createLogFile();
}


//récupération nombre de trajet
function getTour() {
    document.addEventListener('deviceready', function() {
        cordovaHTTP.post(server + "/getNumberOfTours", {
            username: 'rout-ine',
            password: 'extranetrout-ine81'
        }, { Authorization: "OAuth2: token" }, function(response) {
            // prints 200
            console.log(response.status);
            try {
                response = JSON.parse(response.data);
                // prints test
                let nbTour = response.numberOfTours;
                nbTour = nbTour + 1;
                //Menu déroulant !
                let dropdown = $('#dropdown1');

                dropdown.empty();

                for (let i = 1; i <= nbTour; i++) {

                    let link = $('<a id="myTruck' + i + '" href="#!">').text('Tournée' + i);

                    if (i == nbTour) {
                        link = $('<a id="myTruck' + i + '" href="#!">').text('Tournée Extérieur Albi');
                    }

                    link.click(function(e) {
                        if (i == nbTour) {
                            trajet = 'Outside';
                        } else {
                            trajet = i - 1;
                        }
                        downloadFile();
                        downloadTrip();
                    });

                    dropdown.append($('<li>').append(link));

                    dropdown.append($('<li class="divider">'));
                }

            } catch (e) {
                console.error("JSON parsing error");
            }
        }, function(response) {
            // prints 403
            alert(response.status);
            //prints Permission denied 
            alert(JSON.stringify(response.error, null, 2));
        });
    });
}

//génére le fichier de log
function createLogFile() {
    document.addEventListener('deviceready', function() {
        var Fichier = "log.txt";
        var Texte = "{}";

        fail = function(e) { alert(JSON.stringify(e)); }
        gotFileWriter = function(writer) { writer.write(Texte); };
        gotFileEntry = function(fileEntry) { fileEntry.createWriter(gotFileWriter, fail); };
        gotFS = function(fileSystem) { fileSystem.root.getFile(Fichier, { create: true }, gotFileEntry, fail); };
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        alert('Fichier Log.txt créé');
    });
}

//GeoJson Layers
function truck() {

    reset();

    L.geoJSON(geojsonFeature, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: new L.AwesomeNumberMarkers({
                    number: feature.properties.waypoint_index,
                    markerColor: "darkred"
                })
            });
        },
        onEachFeature: onEachFeature,
    }).addTo(map);

    L.geoJSON(jsonFeatureTrip.geometry, {
        style: {
            "color": "#8b0000"
        }
    }).addTo(map);
}

function addLine(string, line) {
    return string + '<br>' + line;
}

function onEachFeature(feature, layer) {
    //JSON.stringify(whatYouWant)

    let p = feature.properties;
    let popContent = p.label + (p.special != undefined ? ', ' + p.special : '');

    for (let b of feature.properties.beneficiaries) {
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
        if (b.phones) {
            popContent = addLine(popContent, b.phones)
        }
        if (b.note) {
            var label = '<u>Note :</u>'
            popContent = addLine(popContent, label);
            n = '<FONT color="red"><b>' + b.note + '</b></FONT>';
            popContent = addLine(popContent, n);
        }
    }
    //Si l'objet contient une note -> l'afficher

    let div_popup = L.DomUtil.create('div');

    div_popup.innerHTML = '<ul><li id="inline"><a href="#" class="check"><i class="icon ion-checkmark-circled"></i></a></li>' +
        '<li id="inline"><a href="#" class="cancel"><i class="icon ion-android-cancel"></i></a></li>' +
        '<input id="msg">' +
        '<a href="#" class="form"><i class="icon ion-clipboard"></i></a></ul>' +
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

    //Ecriture dans un fichier
    $('a.form', div_popup).on('click', function() {
        var x;
        x = form(x);
        console.log(x);
        document.addEventListener('deviceready', function() {
            var Fichier = "log.txt";
            //N° de tournée / id de l'adresse / Adresse mac de la tablette / message perso / date et heure
            //let dateMsg = new Date();
            var Texte = new Object();
            Texte.address_id = feature.id;
            Texte.message = x;
            //Texte.date = dateMsg;
            Texte.uuid = device.uuid;
            Texte.tour_number = feature.properties.tour.num;

            //Lecture pour réécriture
            readLog(function() {
                logFile[new Date()] = Texte;
                alert(JSON.stringify(logFile, null, 2));

                fail = function(e) { alert(JSON.stringify(e)); }
                gotFileWriter = function(writer) { writer.write(JSON.stringify(logFile, null, 2)); };
                gotFileEntry = function(fileEntry) { fileEntry.createWriter(gotFileWriter, fail); };
                gotFS = function(fileSystem) { fileSystem.root.getFile(Fichier, { create: true }, gotFileEntry, fail); };
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
            });
        });
    });
}

//Vérification connection
function checkConnection() {

    document.addEventListener('deviceready', function() {
        var etatConnexion = navigator.connection.type;

        var etats = {};
        etats[Connection.UNKNOWN] = 'Unknown connection';
        etats[Connection.ETHERNET] = 'Ethernet connection';
        etats[Connection.WIFI] = 'WiFi connection';
        etats[Connection.CELL_2G] = 'Cell 2G connection';
        etats[Connection.CELL_3G] = 'Cell 3G connection';
        etats[Connection.CELL_4G] = 'Cell 4G connection';
        etats[Connection.CELL] = 'Cell generic connection';
        etats[Connection.NONE] = 'No network connection';

        etatInternet = etats[etatConnexion];
    });
}

//Clear du fichier log
function clearLog() {
    document.addEventListener('deviceready', function() {
        var Fichier = "log.txt";
        var Texte = "{}";

        fail = function(e) { alert(JSON.stringify(e)); }
        gotFileWriter = function(writer) { writer.write(Texte); };
        gotFileEntry = function(fileEntry) { fileEntry.createWriter(gotFileWriter, fail); };
        gotFS = function(fileSystem) { fileSystem.root.getFile(Fichier, { create: true }, gotFileEntry, fail); };
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        //alert('Log.txt nettoyé');
    });
}

/* PLUS UTILISEES -> Remplacée par post et parsage dans une variable pour authentification
//Lecture d'un fichier adresses
function readAddresses() {

    document.addEventListener('deviceready', function() {

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
            console.dir(f);
        }, failReadAddresses);
        //This alias is a read-only pointer to the app itself
        window.resolveLocalFileSystemURL("file:///storage/emulated/0/Download/tourAddresses" + trajet + ".json", gotFileAddresses, failReadAddresses);
    });
}

function failReadAddresses(e) {
    console.log("FileSystem Error");
    console.dir(e);
}

function gotFileAddresses(fileEntry) {

    fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function(e) {
            console.log(this.result);

            geojsonFeature = JSON.parse(this.result);
            //document.querySelector("#readFile").innerHTML = this.result;
            if (trajet == 'Outside') {
                let numTournee = 'Extérieur Albi';
                alert('Tournée ' + numTournee + ' sélectionnée.');
            } else {
                let numTournee = trajet + 1;
                alert('Tournée N°' + numTournee + ' sélectionnée.');
            }

            truck();
        }

        reader.readAsText(file);
    });


}

//Lecture d'un fichier trip
function readTrip() {

    document.addEventListener('deviceready', function() {

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
            console.dir(f);
        }, failReadTrip);

        //This alias is a read-only pointer to the app itself
        window.resolveLocalFileSystemURL("file:///storage/emulated/0/Download/tourTrip" + trajet + ".json", gotFileTrip, failReadTrip);

    });
}

function failReadTrip(e) {
    console.log("FileSystem Error");
    console.dir(e);
}

function gotFileTrip(fileEntry) {

    fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function(e) {
            console.log(this.result);
            jsonFeatureTrip = JSON.parse(this.result);
            //document.querySelector("#readFile").innerHTML = this.result;
            truck();
        }

        reader.readAsText(file);
    });


}
*/

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

// Téléchargement 2.0 ! 

function downloadFile() {
    cordovaHTTP.post(server + "/downloadAddresses", {
            username: 'rout-ine',
            password: 'extranetrout-ine81',
            num: trajet
        }, { Authorization: "OAuth2: token" }, function(response) {
            // prints 200
            try {
                geojsonFeature = JSON.parse(response.data);
                //document.querySelector("#readFile").innerHTML = this.result;
                if (trajet == 'Outside') {
                    let numTournee = 'Extérieur Albi';
                    alert('Tournée ' + numTournee + ' sélectionnée.');
                } else {
                    let numTournee = trajet + 1;
                    alert('Tournée N°' + numTournee + ' sélectionnée.');
                }
                notifySuccess();
                truck();
            } catch (e) {
                console.error("JSON parsing error");
            }
        },
        function(response) {
            // prints 403
            alert(response.status);
            //prints Permission denied 
            alert(JSON.stringify(response.error, null, 2));
        });
}

function downloadTrip() { //A terme : écrire variable dans un fichier
    cordovaHTTP.post(server + "/downloadTrip", {
            username: 'rout-ine',
            password: 'extranetrout-ine81',
            num: trajet
        }, { Authorization: "OAuth2: token" }, function(response) {
            // prints 200
            try {
                jsonFeatureTrip = JSON.parse(response.data);
                notifySuccess();
                truck();
            } catch (e) {
                console.error("JSON parsing error");
            }
        },
        function(response) {
            // prints 403
            alert(response.status);
            //prints Permission denied 
            alert(JSON.stringify(response.error, null, 2));
        });
}


//Téléchargement (Supprime le fichier si déjà existant et le remplace)
/*
function downloadFile() {
    document.addEventListener('deviceready', function() {
        let fileTransfer = new FileTransfer();
        let uri = encodeURI(server + "/downloadAddresses?num=" + trajet);
        //DL sur la carte SD
        //fileURL = "file:///storage/sdcard1/Download/Test/cordova_bot.png";
        //DL sur la mémoire interne
        let fileURL = "file:///storage/emulated/0/Download/tourAddresses" + trajet + ".json";

        var options = new FileUploadOptions();
        options.chunkedMode = false;
        options.headers = {
            Connection: "close"
        };

        fileTransfer.download(
            uri,
            fileURL,
            function(entry) {
                notifySuccess();
                readAddresses();
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

        let fileTransferTrip = new FileTransfer();
        uri = encodeURI(server + "/downloadTrip?num=" + trajet);
        //DL sur la carte SD
        //fileURL = "file:///storage/sdcard1/Download/Test/cordova_bot.png";
        //DL sur la mémoire interne
        fileURL = "file:///storage/emulated/0/Download/tourTrip" + trajet + ".json";

        var options = new FileUploadOptions();
        options.chunkedMode = false;
        options.headers = {
            Connection: "close"
        };

        fileTransferTrip.download(
            uri,
            fileURL,
            function(entry) {
                notifySuccess();
                readTrip();
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
}
*/


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

}

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

    zip.unzip("/storage/emulated/0/Download/Tiles.zip", "/storage/emulated/0/Download", function() {
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
        	if (markerGeo) {
        		markerGeo.remove();
        	}
            var markerGeo = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
            //marker.bindPopup("Ma position :<br> Latitude : " + position.coords.latitude + ',<br>Longitude ' + position.coords.longitude).openPopup();
            map.setView([position.coords.latitude, position.coords.longitude]) //Centre la carte sur votre position actuelle
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

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
