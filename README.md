# Itineraire_tournees
Projet de stage fin de 2ème année de DUT

Le Projet consiste en utilisant cordova de développer une application qui servirait à la mairie d'Albi à distribuer les repas de 700 bénéficiaires sur la commune et ses alentours.

L'application doit permettre d'afficher une carte téléchargée sur un serveur, de se géolocaliser, d'afficher un trajet ainsi que des points d'arrêts contenant les bénéficiaires (7 tournéees différentes) et leurs détails, de vérifier si la livraison a été effectuée ou non ainsi que de pouvoir envoyer un rapport si l'adresse a un soucis de géocodage tout ça en mode hors connexion. Dans le futur, il serait possible de rajouter un gps intégrer à l'application qui indiquerait le chemin à suivre.

Données Json de type :
var geojsonFeature = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          lat,
          lng
        ]
      },
      "properties": {
        "label": "adresse",
        "town": "code & city",
        "beneficiaries": [],
        "waypoint_index": 0,
        "special": "spécificité"
      },
      "id": 1
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          lat,
          lng
        ]
      },
      "properties": {
        "label": "adresse",
        "town": "code & city",
        "beneficiaries": [
          {
            "id": 106,
            "name": "nom + prenom",
            "birthdate": "birthdate",
            "address_additional": "",
            "phones": [
              "phone number"
            ]
          }
        ],
        "waypoint_index": 1
      },
      "id": 100
    },
	]
}
