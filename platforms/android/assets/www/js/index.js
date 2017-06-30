let server = 'http://10.1.0.205:9226'; // Adresse du serveur
let username = 'rout-ine'; // Nom d'utilisateur pour se connecter au serveur
let password = 'extranetrout-ine81'; // Mot de passe pour se connecter au serveur
let tpsInit = 100; // Initialisation de l'appli (compter nb tournée/dezip/initMap) après X ms.
let tpsGeoloc = 2000; //Temps entre chaques géolocalisations
let tpsCheckConnection = 10000; //temps entre chaques vérifications de la connexion 
let tpsVerifTournees = 10000; // temps de vérifs entre chaques demandes du nb de tournées au serveur
let tpsNotif = 5000; // Temps entre chaques vérification du contenu du fichier pour gérer les notifications
let tpsEnvoi = 30000; //Teps entres chaques envoie du contenu du fichier au serveur si il y a du contenu
let layer; //Layer des tuiles de la carte
let map; //Objet map
let markerGeo = 1; // marker de géolocalisation
let trajet; //compteur de trajets ( création du menu )
let etatInternet; // Etat de la connexion , testé à intervalle régulier
let messageNotif; // Message d'une notif
checkConnection(); // Appel de la fonction de vérification de la connexion
let geojsonFeature = new Object(); //objet JSON des adresses
let jsonFeatureTrip = new Object(); //Objet JSON des trajets
let initialisation = 0; // Initialisation de la carte (offline = chargée sans connexion/ online = chargée sous couverture)
let state = 'day'; // Etat visuel de l'application ('day' ou 'night')


// Fonction se lançant au chargement du "body" de la page
function initmap() {

    map = L.map('map').setView([43.924, 2.1554], 13);

    layer = L.tileLayer('img/Tiles/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://openstreetmap.fr/">OpenStreetMap</a>',
        minZoom: 13,
        maxZoom: 13
    }).addTo(map);



    //Télécharger nouvelle map
    /* Map Indisponible sur le serveur, cette fonction est donc innutile
    $("#myDownload").click(function(e) {
        if (etatInternet == 'none') {
            alert('Aucune connection détectée');
        } else {
            alert('Télécharger la nouvelle map !');
            //Télécharger la nouvelle map
        }
    });
    */
    //Action Bouton Avion en Papier
    $("#sendLogs").click(function(e) {
        uploadFile();
    });

    //Action Bouton soleil
    $("#day").click(function(e) {
        switchDay();
    });

    //Action Bouton lune
    $("#night").click(function(e) {
        switchNight();
    });

    //Action Bouton Download
    $("#getTour").click(function(e) {
        getTour();
    });

    //Initialisation du menu en mode Hors connexion
    $("#initOfflineMenu").click(function(e) {
        if (etatInternet == 'none') {
            initOfflineMenu();
        }
    });

    hideParam(); //Fonction cachant le bouton retour et le contenu de la fenêtre param

    //Temps après lequel la nouvelle map se dezip et s'initialise
    setTimeout(function() { initAppli(); }, tpsInit);

    //Intervalle de géolocalisation de l'appareil
    //setInterval(function() { currentLocation(); }, tpsGeoloc);
    setTimeout(function() { currentLocation(); }, tpsGeoloc);

    //Intervalle de vérficatio nde la connexion
    setInterval(function() {
        checkConnection();
    }, tpsCheckConnection);

    // Intervalle de vérification du nobmre de tournées sur le serveur si l'appli a été démarrée sans internet
    setInterval(function() {
        //Test si l'application a été lancé sous connexion ou non
        if (initialisation == 'offline') {
            // Si elle a été initialisé sous connexion et qu'elle a accès à internet : telechargement des tournees 
            if (etatInternet != 'none') {
                getTour();
                initialisation = 'effectuée';
            }
        }
    }, tpsVerifTournees);

    //Intervalle de vérification du fichier pour notifier l'utilisateur
    setInterval(function() {
        checkFileNotif();
    }, tpsNotif);

    //Intervalle de la vérification du fichier pour l'envoi du fichier au serveur
    setInterval(function() {
        checkFileEnvoi();
    }, tpsEnvoi);

}

//Mode jour de l'application
// Récupère tous les éléments graphiques pour changer leurs classes et donc leurs couleurs
function switchDay() {
    state = 'day';
    document.getElementById("iconSwitchDay").className = "buttonSwitchDay ion-ios-sunny";
    document.getElementById("iconSwitchNight").className = "buttonSwitchDay ion-ios-moon";
    document.getElementById("notif").className = "icon-menuDay ion-paper-airplane";
    document.getElementById("rout").className = "icon-menuDay ion-map";
    document.getElementById("param").className = "icon-menuDay ion-gear-a";
    document.getElementById("return").className = "icon-menuDay ion-arrow-return-left";
    document.getElementById("body").className = "light-green";
    document.getElementById("dropdown1").className = "dropdown-content";
    document.getElementById("menu").className = "nav-wrapper light-green";
    document.getElementById("paramMain").className = "z-depth-3 aideMain light-green lighten-2";
    document.getElementById("paramP").className = "aide";
    document.getElementById("downloadButton").className = "buttonSwitchDayMedium ion-archive"
    document.getElementById("initOfflineMenuIcon").className = "buttonSwitchDayMedium ion-loop"
}

//Mode nuit de l'application
// Récupère tous les éléments graphiques pour changer leurs classes et donc leurs couleurs
function switchNight() {
    state = 'night';
    document.getElementById("iconSwitchDay").className = "buttonSwitchNight ion-ios-sunny";
    document.getElementById("iconSwitchNight").className = "buttonSwitchNight ion-ios-moon";
    document.getElementById("notif").className = "icon-menuNight ion-paper-airplane";
    document.getElementById("rout").className = "icon-menuNight ion-map";
    document.getElementById("param").className = "icon-menuNight ion-gear-a";
    document.getElementById("return").className = "icon-menuNight ion-arrow-return-left";
    document.getElementById("body").className = "blue darken-4";
    document.getElementById("dropdown1").className = "dropdown-content nightMenu";
    document.getElementById("menu").className = "nav-wrapper blue darken-4";
    document.getElementById("paramMain").className = "z-depth-3 aideMain nightParam";
    document.getElementById("paramP").className = "aideNight";
    document.getElementById("downloadButton").className = "buttonSwitchNightMedium ion-archive"
    document.getElementById("initOfflineMenuIcon").className = "buttonSwitchNightMedium ion-loop"
}

//Affichage fenêtre paramètres
// Récupère tous les éléments graphiques pour passer de l'affichage de la fenêtre principale aux paramètres
function openParam() {

    let div = document.getElementById("paramButton");
    div.style.display = "none";
    div = document.getElementById("sendButton");
    div.style.display = "none";
    div = document.getElementById("menuButton");
    div.style.display = "none";
    div = document.getElementById("map");
    div.style.display = "none";
    let divParam = document.getElementById("paramContent");
    divParam.style.display = "block";
    divParam = document.getElementById("returnButton");
    divParam.style.display = "block";

}

//Masquage fenêtre paramètres
// Récupère tous les éléments graphiques pour passer de l'affichage des paramètres à la fenêtre principale
function hideParam() {

    let divParam = document.getElementById("paramContent");
    divParam.style.display = "none";
    divParam = document.getElementById("returnButton");
    divParam.style.display = "none";
    let div = document.getElementById("paramButton");
    div.style.display = "block";
    div = document.getElementById("map");
    div.style.display = "block";
    div = document.getElementById("sendButton");
    div.style.display = "block";
    div = document.getElementById("menuButton");
    div.style.display = "block";
}

//Init Offline menu
// Permet de charger le menu de l'application hors connexion
function initOfflineMenu() {
    let dropdown = $('#dropdown1');
    let link = $('<a href="#!">').text('Tournée Locale');
    link.click(function(e) {
        readAddresses();
        readTrip();
    });
    dropdown.append($('<li>').append(link));
}

//Initialisation de l'application
function initAppli() {
    if (etatInternet == 'none') {
        //Decompression de l'archive map
        unZip();
        //Initialisation map décompressé
        initMapUnziped();
        initialisation = 'offline';
        // Initialisation du menu offline
        initOfflineMenu();

        alert('Map Initialisée, nécessite une connexion pour charger les tournées');
    } else {
        // Initialisation menu online
        getTour();
        //Decompression de l'archive map
        unZip();
        //Initialisation map décompressé
        initMapUnziped();
        initialisation = 'effectuée';
        alert('Map initialisée, tournées chargées');
    }
}


//Vérifie si il y a du contenu dans le fichier 'log.txt' pour la gestion des notifications
function checkFileNotif() {

    // Lis le contenu du fichier log.txt
    document.addEventListener('deviceready', function() {

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
            console.dir(f);
        }, failReadCheckNotif);

        window.resolveLocalFileSystemURL("file:///storage/emulated/0/log.txt", gotFileCheckNotif, failReadCheckNotif);
    });

    // lis le fichier, fais la comparaison et 
    function gotFileCheckNotif(fileEntry) {
        fileEntry.file(function(file) {
            reader = new FileReader();

            reader.onloadend = function(e) {
                console.log(this.result);
                var checkLog = JSON.parse(this.result);
                if (JSON.stringify(checkLog) != '{}') {
                    if (state == 'day')
                        document.getElementById("notif").className = 'icon-menuDay ion-paper-airplane icon-notif';
                    else {
                        document.getElementById("notif").className = 'icon-menuNight ion-paper-airplane icon-notif';
                    }
                } else {
                    if (state == 'day') {
                        document.getElementById("notif").className = 'icon-menuDay ion-paper-airplane';
                    } else {
                        document.getElementById("notif").className = 'icon-menuNight ion-paper-airplane';
                    }
                }
            }
            reader.readAsText(file);
        });


    }

    //Erreur lecture
    function failReadCheckNotif(e) {
        //alert("Fichier introuvable");
        //alert(JSON.stringify(e, null, 2));
        createLogFile();
    }
}

//Vérifie si il y a du contenu dans le fichier 'log.txt' pour l'envoyer au serveur
function checkFileEnvoi() {

    document.addEventListener('deviceready', function() {

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
            console.dir(f);
        }, failReadCheckEnvoi);

        //This alias is a read-only pointer to the app itself
        window.resolveLocalFileSystemURL("file:///storage/emulated/0/log.txt", gotFileCheckEnvoi, failReadCheckEnvoi);
    });

    //Vérifie, compare, test la connexion pour envoyer le fichier
    function gotFileCheckEnvoi(fileEntry) {
        fileEntry.file(function(file) {
            reader = new FileReader();

            reader.onloadend = function(e) {
                console.log(this.result);
                var checkLog = JSON.parse(this.result);
                if (JSON.stringify(checkLog) != '{}') {
                    if (etatInternet != 'none') {
                        uploadFile();
                    }

                }

            }
            reader.readAsText(file);
        });


    }
    // Erreur lecture 
    function failReadCheckEnvoi(e) {
        alert("FileSystem Error");
        alert(JSON.stringify(e, null, 2));
    }
}

//Envoyer un fichier au serveur
function uploadFile() {
    document.addEventListener('deviceready', function() {
        //Authentification au serveur
        cordovaHTTP.uploadFile(server + "/tabletLogsUpload", {
            username: username,
            password: password

        }, { Authorization: "OAuth2: token" }, "file:///storage/emulated/0/log.txt", "file", function(response) {
            //alert('Statut: ' + response.status);
            //alert('Message: ' + response.data);
            //Réponse positive du verveur -> Suppression du fichier de Log
            clearLog();
        }, function(response) {
            alert('Statut: ' + response.status);
            alert('Erreur: ' + response.error);
            alert('Message: ' + response.data);
        });
    });

    //Gestion couleur de l'icone selon jour et nuit
    if (state == 'day') {
        document.getElementById("notif").className = 'icon-menuDay ion-paper-airplane';
    } else {
        document.getElementById("notif").className = 'icon-menuNight ion-paper-airplane';
    }

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
                // Lis le contenu du fichier, ajoute le nouveau contenu et réécrit le tout dans le fichier (permet l'écriture sans suppression)
                callback();
                //document.querySelector("#readFile").innerHTML = this.result;
            }
            reader.readAsText(file);
        });
    }

}

// Erreur lecture -> généralement causée par la suppresion du fichier de log -> création du fichier lors de l'erreur
function failReadLog(e) {
    alert("Erreur de lecture: Création d'un fichier log.txt");
    createLogFile();
}


//Récupère le nombre de trajets sur le serveur pour construire le menu ainsi que les liens de chaques zone du menu
function getTour() {
    //Connexion au serveur
    document.addEventListener('deviceready', function() {
        cordovaHTTP.post(server + "/getNumberOfTours", {
            username: username,
            password: password
        }, { Authorization: "OAuth2: token" }, function(response) {
            console.log(response.status);
            try {
                //Récupèrele nb de tournées standards sur le serveur
                response = JSON.parse(response.data);
                // prints test
                let nbTour = response.numberOfTours;
                // Ajoute 1 car il y a 1 tournée spéciale (tournée extérieure)
                nbTour = nbTour + 1;
                //Menu déroulant ! 
                let dropdown = $('#dropdown1');
                //Vide le menu
                dropdown.empty();

                // Crée chaques éléments du menu, le dernier élément étant la tournée extérieure
                for (let i = 1; i <= nbTour; i++) {

                    let link = $('<a href="#!">').text('Tournée' + i);

                    if (i == nbTour) {
                        link = $('<a href="#!">').text('Tournée Extérieur Albi');
                    }

                    link.click(function(e) {
                        if (i == nbTour) {
                            trajet = 'Outside';
                        } else {
                            trajet = i - 1;
                        }
                        if (etatInternet != 'none') {
                            downloadFile();
                            downloadTrip();
                        } else {
                            readAddresses();
                            readTrip();
                        }
                    });

                    dropdown.append($('<li>').append(link));

                    dropdown.append($('<li class="divider">'));
                }

            } catch (e) {
                console.error("JSON parsing error");
            }
        }, function(response) {
            //Erreur de communication avec le serveur
            alert(response.status);
            alert(JSON.stringify(response.error, null, 2));
        });
    });
}

//Crée un fichier de log contenant "{}" permettant après de compléter avec des objets JSON et que le fichier puisse être traité comme un fichier JSON
function createLogFile() {
    document.addEventListener('deviceready', function() {
        var Fichier = "log.txt";
        var Texte = "{}";

        fail = function(e) { alert(JSON.stringify(e)); }
        gotFileWriter = function(writer) { writer.write(Texte); };
        gotFileEntry = function(fileEntry) { fileEntry.createWriter(gotFileWriter, fail); };
        gotFS = function(fileSystem) { fileSystem.root.getFile(Fichier, { create: true }, gotFileEntry, fail); };
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    });
}

//GeoJson Layers // Chargement du trajet (adresse et itiniéraire)
function truck() {

    reset();

    L.geoJSON(geojsonFeature, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                // Utilise le plugin AwesomeNumberMarkers pour les icones des marqueurs, affecte leur index dansl a tournée comme numéro, ainsi que la couleur rouge foncé
                icon: new L.AwesomeNumberMarkers({
                    number: feature.properties.waypoint_index,
                    markerColor: "darkred"
                })
            });
        },
        // Pour chaques marqueurs : fonction onEachFeature() 
        onEachFeature: onEachFeature,
    }).addTo(map);

    L.geoJSON(jsonFeatureTrip.geometry, {
        style: {
            // Couleur du trajet : rouge foncé
            "color": "#8b0000"
        }
    }).addTo(map);
}

//Concaténation des chaines de caractères
function addLine(string, line) {
    return string + '<br>' + line;
}

//Fonction déterminant le comportement de chaques marqueurs WARNING : Lors d'une erreur dans cette fonction, ils ne sont pas affichés 
function onEachFeature(feature, layer) {

    let p = feature.properties;
    let popContent = p.label + (p.special != undefined ? ', ' + p.special : '');
    let nbBenef = 0;
    let popContent1 = "";
    let popContent2 = "";
    let popContent3 = "";
    let popContent4 = "";

    //feature.properties correspond aux propriété de l'adresse du marqueur 
    for (let b of feature.properties.beneficiaries) {
        nbBenef = nbBenef + 1;
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
        if (b.address_additional != null) {
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
            n = '<FONT color="red"><b>' + b.note + '</b></FONT><br>';
            popContent = addLine(popContent, n);
        }
        if (nbBenef == 1) {
            popContent1 = popContent;
        }
        if (nbBenef == 2) {
            popContent2 = popContent;
        }
        if (nbBenef == 3) {
            popContent3 = popContent;
        }
        if (nbBenef == 4) {
            popContent4 = popContent;
        }

        popContent = "";
    }
    /*
        alert('nbBenef: ' + nbBenef);
        alert('popContent1: ' + popContent1);
        alert('popContent2: ' + popContent2);
        alert('popContent3: ' + popContent3);
        alert('popContent4: ' + popContent4);
    */
    let div_button = L.DomUtil.create('div');
    let div_popup = L.DomUtil.create('div');
    //Création des boutons
    div_button.innerHTML = '<ul><li class="inline1"><a href="#" class="check"><i class="icon ion-checkmark-circled"></i></a></li>' +
        '<li class="inline2"><a href="#" class="cancel"><i class="icon ion-android-cancel"></i></a></li>' +
        '<input id="msg">' +
        '<center><a href="#" class="form"><i class="icon ion-paper-airplane"></i></a></ul></center>' +
        '<p id="retour"></p>';

    if (nbBenef == 0) {
        div_popup.innerHTML = addLine(popContent, div_button.innerHTML);
    }
    if (nbBenef == 1) {
        div_popup.innerHTML = addLine(popContent1, div_button.innerHTML);
    }
    if (nbBenef == 2) {
        let tmp1 = addLine(popContent1, div_button.innerHTML);
        let tmp2 = addLine(popContent2, div_button.innerHTML);
        div_popup.innerHTML = addLine(tmp1, tmp2);
    }
    if (nbBenef == 3) {
        let tmp1 = addLine(popContent1, div_button.innerHTML);
        let tmp2 = addLine(popContent2, div_button.innerHTML);
        div_popup.innerHTML = addLine(tmp1, tmp2);
        let tmp3 = addLine(popContent3, div_button.innerHTML);
        div_popup.innerHTML = addLine(div_popup.innerHTML, tmp3);
    }
    if (nbBenef == 4) {
        let tmp1 = addLine(popContent1, div_button.innerHTML);
        let tmp2 = addLine(popContent2, div_button.innerHTML);
        div_popup.innerHTML = addLine(tmp1, tmp2);
        let tmp3 = addLine(popContent3, div_button.innerHTML);
        div_popup.innerHTML = addLine(div_popup.innerHTML, tmp3);
        let tmp4 = addLine(popContent4, div_button.innerHTML);
        div_popup.innerHTML = addLine(div_popup.innerHTML, tmp4);
    }

    layer.bindPopup(div_popup);

    //si marker rouge -> vert
    //Futur envoie de logs pour passage d'un livreur 
    $('a.check', div_popup).on('click', function() {
        checkButton();
    });

    //si marker vert -> rouge
    //Envoie de logs annulation du passage ( erreur livreur ou autre)
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
            Texte.beneficiarie = feature.beneficiaries.name;
            Texte.uuid = device.uuid;
            Texte.tour_number = feature.properties.tour.num;

            //Lecture pour réécriture
            // Objet Json sous forme de dictionnaire : date = clef, others = valeurs (address_id, message, uuid, tour_number)
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

function checkButton() {
    layer.setIcon(new L.AwesomeNumberMarkers({
        number: feature.properties.waypoint_index,
        markerColor: "green"
    }));
}

//Vérification connection 
function checkConnection() {

    document.addEventListener('deviceready', function() {
        etatInternet = navigator.connection.type;
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
    });
}

//Lecture d'un fichier adresses
function readAddresses() {

    document.addEventListener('deviceready', function() {

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function(f) {
            console.dir(f);
        }, failReadAddresses);

        window.resolveLocalFileSystemURL("file:///storage/emulated/0/tourAddresses.json", gotFileAddresses, failReadAddresses);
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
            alert('Tournée téléchargée sélectionnée.');
            //Chargement des fichiers pour initilisation Itinéraire et Marqueurs 
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

        window.resolveLocalFileSystemURL("file:///storage/emulated/0/tourTrip.json", gotFileTrip, failReadTrip);

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


function registerFile() {

}

// Téléchargement 2.0 !
function downloadFile() {
    cordovaHTTP.post(server + "/downloadAddresses", {
            username: username,
            password: password,
            num: trajet
        }, { Authorization: "OAuth2: token" }, function(response) {
            // prints 200
            try {
                geojsonFeature = JSON.parse(response.data);
                // Change le nom  dans le menu si c'est la tournée extérieure ainsi que celui de la pop up de chargement
                if (trajet == 'Outside') {
                    let numTournee = 'Extérieur Albi';
                    alert('Tournée ' + numTournee + ' sélectionnée.');
                } else {
                    let numTournee = trajet + 1;
                    alert('Tournée N°' + numTournee + ' sélectionnée.');
                }
                //Envoie une notification de succès
                messageNotif = "Succès du téléchargement";
                notify();
                document.addEventListener('deviceready', function() {
                    var Fichier = "tourAddresses.json";
                    var Texte = JSON.stringify(geojsonFeature, null, 2);

                    fail = function(e) { alert(JSON.stringify(e)); }
                    gotFileWriter = function(writer) { writer.write(Texte); };
                    gotFileEntry = function(fileEntry) { fileEntry.createWriter(gotFileWriter, fail); };
                    gotFS = function(fileSystem) { fileSystem.root.getFile(Fichier, { create: true }, gotFileEntry, fail); };
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
                });
                truck();
            } catch (e) {
                console.error("JSON parsing error");
            }
        },
        function(response) {
            alert(response.status);
            alert(JSON.stringify(response.error, null, 2));
        });
}

//Téléchargement d'un itinéraire et de ses adresses

function downloadTrip() {
    //Authentification au serveur, précision du num de la tournée voulue (Outside pour tournée extérieure)
    cordovaHTTP.post(server + "/downloadTrip", {
            username: username,
            password: password,
            num: trajet
        }, { Authorization: "OAuth2: token" }, function(response) {
            try {
                jsonFeatureTrip = JSON.parse(response.data);
                messageNotif = "Succès du téléchargement";
                notify();
                document.addEventListener('deviceready', function() {
                    //Ecrit le résultat du téléchargement dans un fichier pour l'utilisation hors connexion
                    var Fichier = "tourTrip.json";
                    var Texte = JSON.stringify(jsonFeatureTrip, null, 2);

                    fail2 = function(e) { alert(JSON.stringify(e)); }
                    gotFileWriter2 = function(writer) { writer.write(Texte); };
                    gotFileEntry2 = function(fileEntry) { fileEntry.createWriter(gotFileWriter2, fail2); };
                    gotFS2 = function(fileSystem) { fileSystem.root.getFile(Fichier, { create: true }, gotFileEntry2, fail2); };
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS2, fail2);
                });
                truck();
            } catch (e) {
                console.error("JSON parsing error");
            }
        },
        function(response) {
            alert(response.status);
            alert(JSON.stringify(response.error, null, 2));
        });
}

//Réinitialisation carte après décompression archive
function initMapUnziped() {
    // Supprime l'ancienne map
    map.off();
    map.remove();

    // La remplace par la nouvelle
    map = L.map('map').setView([43.924, 2.1554], 13);

    //Layer carte SD
    //layer = L.tileLayer('/storage/sdcard1/Download/{z}/{x}/{y}.png', {
    //Layer Mémoire interne
    layer = L.tileLayer('/storage/emulated/0/Download/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 18
    }).addTo(map);

}

//Décompression(prend 5-10 minutes : zoom 18 -> Il y a des milliers de png à charger) AJOUTER SUPPRESSION DE L'ARCHIVE
function unZip() {
    /*
        //Récupération sur la carte SD
        zip.unzip("/storage/sdcard1/Download/Tiles.zip", "/storage/sdcard1/Download", function() {
            notify();
        });
    */

    //Décompresse l'archive source - cible
    zip.unzip("/storage/emulated/0/Download/Tiles.zip", "/storage/emulated/0/Download", function() {
        messageNotif = "Archive décompressée avec succès.";
        notify();
    });
}

//Notification

function notify() {

    document.addEventListener('deviceready', function() {

        //Supprime toutes les notifications actives de cette application
        cordova.plugins.notification.local.clearAll();

        var date = new Date();

        cordova.plugins.notification.local.schedule({
            id: 1,
            title: "Offline Routing Notification",
            //Message personnalisé en fonction de la fonction qui appelle la notification 
            message: messageNotif,
            at: date,
        });

    });
}

//réinitialise la carte à son état d'origine
//innutilisée, permet d'afficher la carte stockée dans le dossier img de l'application
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

//Crée le marqueur de geolocalisation
function popMarker(lat, lng) {
    if (markerGeo != 1) {
        markerGeo.remove();
    }
    markerGeo = L.marker([lat, lng]).addTo(map);
}

//Géolocalisation
function currentLocation() {

    function onError(error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    if (navigator.geolocation) {
        //watchPosition: geolocalisation toutes les 3 secondes
        navigator.geolocation.watchPosition(function(position) {
            //alert('Latitude: ' + position.coords.latitude + '\nLongitude: ' + position.coords.longitude);
            popMarker(position.coords.latitude, position.coords.longitude);
        }, onError, { maximumAge: 3000, timeout: 3600000, enableHighAccuracy: true });



        //let markerGeo = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        //marker.bindPopup("Ma position :<br> Latitude : " + position.coords.latitude + ',<br>Longitude ' + position.coords.longitude).openPopup();

    } else {
        //alert("La géolocalisation n'est pas supportée/interdite.");
    }
}
