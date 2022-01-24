const mapJeuxVideo = new Map();
let sectionPage;

window.onload = init;

function init() {
    sectionPage = document.querySelector(".sectionPage");

    if (!sectionPage) {
        throw new error("sectionPage introuvable");
    }

    const btnRechercher = document.querySelector(".btnRechercher");

    if (!btnRechercher) {
        throw new error("btnRechercher introuvable");
    }

    btnRechercher.addEventListener("click", clickBtnRechercher);

}

async function clickBtnRechercher() {
    sectionPage.innerHTML = "";
    const mapJeuxVideo = await telechargerDonnees();
}

async function telechargerDonnees() {
    if (mapJeuxVideo.size > 0) {
        return mapJeuxVideo;
    }
    try {
        const reponse = await fetch("https://www.giantbomb.com/api/games/?api_key=ca43860b5e3eb1bc2856b5612843ec8e65f53a5a&format=json");
        const reponseToJson = await reponse.json();
        const listeJeuxVideo = reponseToJson.results;

        if (!listeJeuxVideo || !Array.isArray(listeJeuxVideo) || listeJeuxVideo.length === 0) {
            throw new Error("Données réponse non conformes")
        }

        for (let i = 0; i < listeJeuxVideo.length; i++) {
            const unJeu = new JeuxVideo(listeJeuxVideo[i]);
            mapJeuxVideo.set(unJeu.id, unJeu);
        }
        // console.log(listeJeuxVideo);
        // console.log(mapJeuxVideo);
        return mapJeuxVideo;


    } catch (error) {
        console.error(error);
        alert("Erreur pendant le téléchargement des jeux video");
    }
}

class JeuxVideo {
    id = -1;
    nom = "";
    imageScreenURL = "";
    imageSmallURL = "";
    plateformes = [];
    dateSortie = -1; //on retourne seulement l'année de sorti du jeu si il n'est pas encore sorti
    descriptionCourte = "";
    descriptionLongue = "";

    constructor(listeJeuxVideo) {
        this.id = listeJeuxVideo.id;
        this.nom = listeJeuxVideo.name;

        const tabPlateformesJeuxVideo = [];
        if (listeJeuxVideo.platforms.length > 0){
            for (let i = 0; i < listeJeuxVideo.platforms.length; i++) {
                const unePlateforme = listeJeuxVideo.platforms[i].abbreviation;
                tabPlateformesJeuxVideo.push(unePlateforme);
            }
        } else {
            tabPlateformesJeuxVideo = null;
        }

        this.plateformes = tabPlateformesJeuxVideo;


        this.imageScreenURL = listeJeuxVideo.image.screen_url;
        this.imageSmallURL = listeJeuxVideo.image.small_url;

        this.dateSortie = listeJeuxVideo.expected_release_year;

        this.descriptionCourte = listeJeuxVideo.deck;
        this.descriptionLongue = listeJeuxVideo.description;
    }
}