const mapJeuxVideo = new Map();
const mapPlateformes = new Map();

window.onload = init;
let sectionPage;
let jeuxVideoFavoris = [];

function init() {

    chargerJeuxVideoFavoris();

    sectionPage = document.querySelector(".sectionPage");

    if (!sectionPage) {
        throw new error("sectionPage introuvable");
    }

    const btnRechercher = document.querySelector(".btnRechercher");

    if (!btnRechercher) {
        throw new error("btnRechercher introuvable");
    }

    btnRechercher.addEventListener("click", clickBtnRechercherJeux);
    
    const btnFavoris = document.querySelector(".btnFavoris");

    if (!btnFavoris) {
        throw new error("btnFavoris introuvable");
    }

    btnFavoris.addEventListener("click", clickBtnFavoris);

}


async function clickBtnRechercherJeux() {
    
    afficherLoader();

    const inputRechercher = document.querySelector(".inputRechercher")
    const valeurInputRechercher = inputRechercher.value;
    const resultatRechercher = await fetch(`https://www.giantbomb.com/api/games/?api_key=ca43860b5e3eb1bc2856b5612843ec8e65f53a5a&format=json&filter=name:${valeurInputRechercher}`);
    const resultatRequeteJson = await resultatRechercher.json();
    const listeResultatJeux = resultatRequeteJson.results;


    sectionPage.innerHTML= "";

    const divJeuxVideo = document.createElement("div");
    divJeuxVideo.classList.add("divJeuxVideo");
    sectionPage.append(divJeuxVideo);

    for (let i = 0; i < listeResultatJeux.length; i++) {
        const unJeuJson = listeResultatJeux[i];
        const unJeu = new JeuxVideo(unJeuJson);

        const divUnJeuVideo = document.createElement("div");
        divUnJeuVideo.classList.add("divSelectionUnJeuVideo");
        divUnJeuVideo.innerHTML = `
            <div class="divGrandeImageJeu">
                <img class="grandeImageJeu" src="${unJeu.imageScreenURL}" alt="Image du jeu : ${unJeu.nom}"/>
            </div>
            <div class="lesPlateformes"></div>
            <div class="divNomJeu">
                <p class="nomJeu">${unJeu.nom}</p>
            </div>
        `;

        const afficherPlateforme = divUnJeuVideo.querySelector(".lesPlateformes");
        for (let i = 0; i < unJeu.plateformes.length; i++) {
            if (i > 3) {
                const plateformesSupplementaires = document.createElement("span");
                plateformesSupplementaires.classList.add("plateformesSupplementaires");
                plateformesSupplementaires.innerText = `+${unJeu.plateformes.length - 4}`;
                afficherPlateforme.append(plateformesSupplementaires);
                break;
            } else  {
                const unePlateforme = document.createElement("span");
                unePlateforme.classList.add("unePlateforme");
                unePlateforme.innerText = unJeu.plateformes[i];
                afficherPlateforme.append(unePlateforme);
            }
        }

        const divGrandeImageJeu = divUnJeuVideo.querySelector(".divGrandeImageJeu")
        divGrandeImageJeu.onclick = () => {
            afficherFicheJeuVideo(unJeu);
        }

        const divNomJeu = divUnJeuVideo.querySelector(".divNomJeu");
        divNomJeu.onclick = () => {
            afficherFicheJeuVideo(unJeu);
        }

        /* Bonus : recherche par plateforme */

        const btnPlateformes = divUnJeuVideo.querySelector(".unePlateforme");

        if (!btnPlateformes) {
            throw new error("btnPlateformes introuvable");
        }
    
        btnPlateformes.addEventListener("click", clickBtnPlateformes);


        divJeuxVideo.append(divUnJeuVideo);
    }
    
}

/* Bonus : Trier par plateforme lors du clic */
async function clickBtnPlateformes() {
    afficherLoader();

    const valeurBtnPlateformes = divJeuxVideo.getElementsByClassName("unePlateforme").value;
    const resultatBtnPlateformes = await fetch(`https://www.giantbomb.com/api/games/?api_key=ca43860b5e3eb1bc2856b5612843ec8e65f53a5a&format=json&filter=platforms:${valeurBtnPlateformes}`);
    const resultatRequeteJson = await resultatBtnPlateformes.json();
    const listeResultatViaPlateformes = resultatRequeteJson.results;

    sectionPage.innerHTML = "";

    const divJeuxVideo = document.createElement("div");
    divJeuxVideo.classList.add("divJeuxVideo");
    sectionPage.append(divJeuxVideo);

    for (let i = 0; i < listeResultatViaPlateformes; i++) {
        const unePlateformeJson = listeResultatViaPlateformes[i];
        const unJeuViaPlateforme = new JeuxVideo(unePlateformeJson);
    
        const divUnJeuVideo = document.createElement("div");
        divUnJeuVideo.classList.add("divSelectionUnJeuVideo");
        divUnJeuVideo.innerHTML = `
        <div class="divGrandeImageJeu">
            <img class="grandeImageJeu" src="${unJeuViaPlateforme.imageScreenURL}" alt="Image du jeu : ${unJeuViaPlateforme.nom}"/>
        </div>
        <div class="lesPlateformes"></div>
        <div class="divNomJeu">
            <p class="nomJeu">${unJeuViaPlateforme.nom}</p>
        </div>
            
        `;
    
        const afficherPlateforme = divUnJeuVideo.querySelector(".lesPlateformes");
        for (let i = 0; i < unJeu.plateformes.length; i++) {
            if (i > 3) {
                const plateformesSupplementaires = document.createElement("span");
                plateformesSupplementaires.classList.add("plateformesSupplementaires");
                plateformesSupplementaires.innerText = `+${unJeu.plateformes.length - 4}`;
                afficherPlateforme.append(plateformesSupplementaires);
                break;
            } else  {
                const unePlateforme = document.createElement("span");
                unePlateforme.classList.add("unePlateforme");
                unePlateforme.innerText = unJeu.plateformes[i];
                afficherPlateforme.append(unePlateforme);
            }
        }
    
        divUnJeuVideo.onclick = () => {
            afficherFicheJeuVideo(unJeu);
        }
    
        divJeuxVideo.append(divUnJeuVideo);
    }

}



function afficherLoader() {
    sectionPage.innerHTML = "";

    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.innerHTML = `
        <h2>Loading...</h2>
    `;
    sectionPage.append(loader);

    const loaderPoint = document.createElement("div");
    loaderPoint.classList.add("loaderPoint");
    loaderPoint.innerHTML = `
        <div class="point" style="--i:0;"></div>
        <div class="point" style="--i:1;"></div>
        <div class="point" style="--i:2;"></div>
        <div class="point" style="--i:3;"></div>
        <div class="point" style="--i:4;"></div>
        <div class="point" style="--i:5;"></div>
        <div class="point" style="--i:6;"></div>
        <div class="point" style="--i:7;"></div>
        <div class="point" style="--i:8;"></div>
        <div class="point" style="--i:9;"></div>
    `;
    loader.append(loaderPoint);
}

function afficherFicheJeuVideo(unJeu) {
    sectionPage.innerHTML = "";


    const divFicheJeuVideo = document.createElement("div");
    divFicheJeuVideo.classList.add("divFicheJeuVideo");
    divFicheJeuVideo.innerHTML=`
        <div class="btnRetour encadrer">Retour</div>
        <div class="ligne1"> 
            <span>${unJeu.nom}</span>
            <div class="divImage">
                <img src="${unJeu.imageSmallURL}" alt="Image du jeu ${unJeu.nom}"/>
            </div>    
        </div>
        <div class="ligne2">
        <div class="divPlateforme">Plateformes : </div>
        <div class="divDateJeu">
        <p class="paragrapheDateSortie">Sortie en : </p>
        <span class="spanDate">${unJeu.dateSortie ? unJeu.dateSortie : "Date indisponible !"}</span>
            </div>
        </div>
        <div class="ligne3">
            <span>${unJeu.descriptionCourte ? unJeu.descriptionCourte : "Pas de description disponible !"}</span>
            <div class="divDescriptionLongue encadrer">
                <span>${unJeu.descriptionLongue && unJeu.descriptionLongue.trim().length > 0 ? unJeu.descriptionLongue : "Pas de description disponible !"}</span>
            </div>
        </div>
        <div class="ligne4">
            <div class="btnFavoris btnAjouterFavoris">Ajouter aux favoris</div>
            <div class="btnFavoris btnRetirerFavoris">Retirer des favoris</div>
        </div>
        `;

        sectionPage.append(divFicheJeuVideo);

        /* Bonus : Bouton Retour */
        const btnRetour = divFicheJeuVideo.querySelector(".btnRetour");

        if (!btnRetour) {
            throw new error("btnRetour est introuvable");
        }

        btnRetour.onclick = () => {
            clickBtnRechercherJeux();
        }

        const boutonAjouterFavoris = document.querySelector(".btnAjouterFavoris");

        if (!boutonAjouterFavoris) {
            throw new error("boutonAjouterFavoris est introuvable");
        }

        boutonAjouterFavoris.onclick = () => {
            ajouterAMesFavoris(unJeu);
        }

        const boutonRetirerFavoris = document.querySelector(".btnRetirerFavoris");

        if (!boutonRetirerFavoris) {
            throw new error("boutonRetirerFavoris est introuvable");
        }

        boutonRetirerFavoris.onclick = () => {
            verifierJeuRetirerFavoris(unJeu);
        }


        const nbPlateformes = divFicheJeuVideo.querySelector(".divPlateforme");
        if (unJeu.plateformes.length === 1) {
            nbPlateformes.innerText = "Plateforme : ";
        }

        const paragrapheDateSortie = divFicheJeuVideo.querySelector(".paragrapheDateSortie");
        let dateAujourdhui = new Date();
        if (unJeu.dateSortie > dateAujourdhui.getFullYear()) {
            paragrapheDateSortie.innerText = "Sortie prévue :";
        }
        
        const afficherPlateforme = divFicheJeuVideo.querySelector(".divPlateforme");
        for (let i = 0; i < unJeu.plateformes.length; i++) {
            if (i > 3) {
                const plateformesSupplementaires = document.createElement("span");
                plateformesSupplementaires.classList.add("plateformesSupplementaires");
                plateformesSupplementaires.innerText = `+${unJeu.plateformes.length - 4}`;
                afficherPlateforme.append(plateformesSupplementaires);
                break;
            } else {
                const unePlateforme = document.createElement("span");
                unePlateforme.classList.add("unePlateforme");
                unePlateforme.innerText = unJeu.plateformes[i];
                afficherPlateforme.append(unePlateforme);
            }
        }       
}


/* Fonctions popups */
    
function afficherPopUpAjouterFavoris() {

    const popup = document.createElement("div");
    popup.classList.add("popup")
    popup.id = "popup-1";
    sectionPage.append(popup);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    popup.append(overlay);

    const content = document.createElement("div");
    content.classList.add("content");
    content.innerHTML = `
        <div class="close-btn" onclick="afficherPopUpAjouterFavoris()">&times;</div>
        <h1>Favoris</h1>
        <p>Le jeu a bien été ajouté dans vos favoris.</p>
    `;
    
    popup.append(content);

    document.getElementById("popup-1").classList.toggle("active");
}

function popupRefuserAjouterFavoris() {

    const popup = document.createElement("div");
    popup.classList.add("popup")
    popup.id = "popup-5";
    sectionPage.append(popup);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    popup.append(overlay);

    const content = document.createElement("div");
    content.classList.add("content");
    content.innerHTML = `
        <div class="close-btn" onclick="popupRefuserAjouterFavoris()">&times;</div>
        <h1>Favoris</h1>
        <p>Vous ne pouvez pas ajouter un jeu qui est déjà dans vos favoris.</p>
    `;
    
    popup.append(content);

    document.getElementById("popup-5").classList.toggle("active");
}

function afficherPopupRetirerFavoris(unJeu) {
    const popup = document.createElement("div");
    popup.classList.add("popup")
    popup.id = "popup-2";
    sectionPage.append(popup);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    popup.append(overlay);

    const content = document.createElement("div");
    content.classList.add("content");
    content.innerHTML = `
        <h2>Favoris</h2>
        <p>Voulez-vous vraiment retirer ce jeu de vos favoris ?</p>
        <div class="btnPopupValiderRefuser">
            <div class="lesBtnPopup btnPopupValider" onclick="afficherPopupRetirerFavoris()">Valider</div>
            <div class="lesBtnPopup btnPopupRefuser" onclick="afficherPopupRetirerFavoris()">Refuser</div>
        </div>
    `;

    const btnPopupValider = content.querySelector(".btnPopupValider");

    if (!btnPopupValider) {
        throw new error("btnPopupValider est introuvable");
    }

    btnPopupValider.onclick = () => {
        retirerJeuxVideoFavoris(unJeu);
        document.getElementById("popup-2").classList.toggle("active");
    }

    popup.append(content);

    document.getElementById("popup-2").classList.toggle("active");
}

function afficherValidationPopupRetirerFavoris() {
    const popup = document.createElement("div");
    popup.classList.add("popup")
    popup.id = "popup-3";
    sectionPage.append(popup);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    popup.append(overlay);

    const content = document.createElement("div");
    content.classList.add("content");
    content.innerHTML = `
        <div class="close-btn" onclick="fermerPopupValiderRetirerFavoris()">&times;</div>
        <h2>Favoris</h2>
        <p>Le jeu a bien été retirer de vos favoris</p>
    `;
    popup.append(content);
 
    document.getElementById("popup-3").classList.toggle("active");
}

function fermerPopupAfficherPopupRetirerFavoris() {
    document.getElementById("popup-2").classList.toggle("active");
}

function fermerPopupValiderRetirerFavoris() {
    document.getElementById("popup-3").classList.toggle("active");
}

function popupRefuserValidationRetirerFavoris() {
    const popup = document.createElement("div");
    popup.classList.add("popup")
    popup.id = "popup-4";
    sectionPage.append(popup);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    popup.append(overlay);

    const content = document.createElement("div");
    content.classList.add("content");
    content.innerHTML = `
        <div class="close-btn" onclick="popupRefuserValidationRetirerFavoris()">&times;</div>
        <h1>Favoris</h1>
        <p>Le jeu n'est pas dans vos favoris, suppression impossible !</p>
    `;
    
    popup.append(content);

    document.getElementById("popup-4").classList.toggle("active");
}



/* Fonction télécharger données dans l'api */


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
        
        return mapJeuxVideo;


    } catch (error) {
        console.error(error);
        alert("Erreur pendant le téléchargement des jeux video");
    }
}

async function telechargerDonneesPlateformes() {
    const mapPlateformes = new Map();
    try {
        const reponse = await fetch("https://www.giantbomb.com/api/platforms/?api_key=ca43860b5e3eb1bc2856b5612843ec8e65f53a5a&format=json");
        const reponseToJson = await reponse.json();
        const listePlateformes = reponseToJson.results;
        
        for (let i = 0; i < listePlateformes.length; i++) {
            const unePlateformeDansListe = new Plateformes(listePlateformes[i]);
            mapPlateformes.set(unePlateformeDansListe.id, unePlateformeDansListe);
        }

        console.log(listePlateformes);
        console.log(mapPlateformes);

        return mapPlateformes;

    }catch (error) {
        console.error(error);
        alert("Erreur lors du téléchargement des plateformes");
    }
}

/* Fonctions Favoris */
function verifierJeu(unJeu) {
    const jeuTrouver = jeuxVideoFavoris.find(function(jeuTableau) {
        return jeuTableau.nom === unJeu.nom;
    });
    if (!jeuTrouver) {
        return false;
    } else {
        return true;
    }
}

function verifierJeuRetirerFavoris(unJeu) {
    const jeuTrouver = jeuxVideoFavoris.find(function(jeuTableau) {
        return jeuTableau.nom === unJeu.nom;
    });
    if (jeuTrouver) {
        afficherPopupRetirerFavoris(unJeu);
    } else {
        popupRefuserValidationRetirerFavoris();
    }
}

function ajouterAMesFavoris(unJeu) {
    if (verifierJeu(unJeu)) {
        popupRefuserAjouterFavoris();
    } else {
        afficherPopUpAjouterFavoris();
        jeuxVideoFavoris.push(unJeu);
        sauvegarderJeuxVideoFavoris();
    }
}

function sauvegarderJeuxVideoFavoris() {
    window.localStorage.setItem("jeuxVideoFavoris", JSON.stringify(jeuxVideoFavoris)); 
}

function chargerJeuxVideoFavoris() {
    const resJson = window.localStorage.getItem("jeuxVideoFavoris");
    if (!resJson) {
        return resJson;
    }

    const resTabParse = JSON.parse(resJson);
    for (let i = 0; i < resTabParse.length; i++) {
        const unJeuObjBasique = resTabParse[i];
        const unJeu = new JeuxVideo(unJeuObjBasique.listeJeuxVideo);
        jeuxVideoFavoris.push(unJeu);
    }
    return jeuxVideoFavoris;
}


function retirerJeuxVideoFavoris(unJeu) {
    jeuxVideoFavoris = jeuxVideoFavoris.filter(function(jeuTableau){
        if (jeuTableau.nom === unJeu.nom) {
            return false;
        } else {
            return true; //Note à moi même : true - conserve l'élément dans le tableau alors que false le supprime
        }
    });
    afficherValidationPopupRetirerFavoris();
    sauvegarderJeuxVideoFavoris();
}

function clickBtnFavoris() {
    sectionPage.innerHTML = '';

    const divJeuxVideo = document.createElement("div");
    divJeuxVideo.classList.add("divJeuxVideo");
    sectionPage.append(divJeuxVideo);

    for (let i = 0; i < jeuxVideoFavoris.length; i++) {
        const unJeu = jeuxVideoFavoris[i];
        const divUnJeuVideo = document.createElement("div");
        divUnJeuVideo.classList.add("divSelectionUnJeuVideo");
        divUnJeuVideo.innerHTML = `
            <div class="divGrandeImageJeu">
                <img class="grandeImageJeu" src="${unJeu.imageScreenURL}" alt="Image du jeu : ${unJeu.nom}"/>
            </div>
            <div class="lesPlateformes"></div>
            <div class="divNomJeu">
                <p class="nomJeu">${unJeu.nom}</p>
            </div>
        `;

        const afficherPlateforme = divUnJeuVideo.querySelector(".lesPlateformes");
        for (let i = 0; i < unJeu.plateformes.length; i++) {
            if (i > 3) {
                const plateformesSupplementaires = document.createElement("span");
                plateformesSupplementaires.classList.add("plateformesSupplementaires");
                plateformesSupplementaires.innerText = `+${unJeu.plateformes.length - 4}`;
                afficherPlateforme.append(plateformesSupplementaires);
                break;
            } else  {
                const unePlateforme = document.createElement("span");
                unePlateforme.classList.add("unePlateforme");
                unePlateforme.innerText = unJeu.plateformes[i];
                afficherPlateforme.append(unePlateforme);
            }
        }

        const divGrandeImageJeu = divUnJeuVideo.querySelector(".divGrandeImageJeu")
        divGrandeImageJeu.onclick = () => {
            afficherFicheJeuVideo(unJeu);
        }

        const divNomJeu = divUnJeuVideo.querySelector(".divNomJeu");
        divNomJeu.onclick = () => {
            afficherFicheJeuVideo(unJeu);
        }

        divJeuxVideo.append(divUnJeuVideo);
    }
}

/* Classe */

class Plateformes {
    id = -1;
    nom = "";

    constructor(listePlateformes) {
        this.id = listePlateformes.id;
        this.nom = listePlateformes.name;
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
    listeJeuxVideo = "";

    constructor(listeJeuxVideo) {
        this.id = listeJeuxVideo.id;
        this.nom = listeJeuxVideo.name;

        const tabPlateformesJeuxVideo = [];

        for (let i = 0; i < listeJeuxVideo.platforms.length; i++) {
            const unePlateforme = listeJeuxVideo.platforms[i].abbreviation;
            tabPlateformesJeuxVideo.push(unePlateforme);
        }



        this.plateformes = tabPlateformesJeuxVideo;


        this.imageScreenURL = listeJeuxVideo.image.screen_url;
        this.imageSmallURL = listeJeuxVideo.image.small_url;

        this.dateSortie = listeJeuxVideo.expected_release_year;

        this.descriptionCourte = listeJeuxVideo.deck;
        this.descriptionLongue = listeJeuxVideo.description;
        this.listeJeuxVideo = listeJeuxVideo;
    }
}