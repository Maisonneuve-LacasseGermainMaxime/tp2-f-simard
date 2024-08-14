import Exercice from "./Exercice.js";
import Formulaire from "./Formulaire.js";
import Router from "./Router.js";

class App {
    static #instance;
	#exercices;
    #listeExerciceHTML;
	#detailsExerciceHTML;
    #boutonSupprimer;
    #panneauListe;
    #panneauDetail;
    #panneauFormulaire;
    #formulaire;
    #router;

    //Permet d'accéder à l'instance de la classe de n'importe où dans le code en utilisant App.instance
    static get instance() {
        return App.#instance;
    }

    constructor() {

        //singleton
        if (App.#instance) {
            return App.#instance;
        } else {
            App.#instance = this;
        }

        //selection HTML
		this.#listeExerciceHTML = document.querySelector("[data-liste-exercices]");
		this.#detailsExerciceHTML = document.querySelector("[data-exercice-infos]");
        this.#boutonSupprimer = this.#detailsExerciceHTML.querySelector("[data-action='supprimer']");
        this.#panneauListe = document.querySelector("[data-panneau='liste']");
        this.#panneauDetail = document.querySelector("[data-panneau='detail']");
        this.#panneauFormulaire = document.querySelector("[data-panneau='formulaire']");

		this.#formulaire = new Formulaire();
        this.#router = new Router();

        //écouteur d'évènement
        this.#boutonSupprimer.addEventListener("click", this.#supprimer.bind(this));

		//appel de fonction au chargement de la page
		
    }

    //récupérer toutes les tâches
    async #recupererTout(){
		const reponse = await fetch("http://js-tp2:8080/backend/exercice/lireTout.php");
        const exercices = await reponse.json();

        this.#exercices = [];
        this.#listeExerciceHTML.innerHTML = "";

        exercices.forEach((exercice) => {
            this.#exercices.push(exercice);
            new Exercice(exercice, this.#listeExerciceHTML);
        });
    }

    //récupérer une tâche selon son ID
    async #recupereUn(idExercice){
		const reponse = await fetch(`http://js-tp2:8080/backend/exercice/lireUn.php?id=${idExercice}`);
        const exercice = await reponse.json();

		const exerciceInfos = exercice[0];

        console.log(exerciceInfos);
		const {id, type, duree, description, date, difficulte} = exerciceInfos;
		
		this.#detailsExerciceHTML.querySelector("[data-type]"). textContent = type.charAt(0).toUpperCase() + type.slice(1);
		this.#detailsExerciceHTML.querySelector("[data-duree]"). textContent = duree;
		this.#detailsExerciceHTML.querySelector("[data-date]"). textContent = date;
		this.#detailsExerciceHTML.querySelector("[data-description]"). textContent = description;
		this.#detailsExerciceHTML.querySelector("[data-difficulte]"). textContent = difficulte;
        this.#detailsExerciceHTML.id = idExercice;

    }

    // ajouter un exercice à la base de donnée
    #ajouter(infos){

    }

    //supprimer un exercice par son id
    async #supprimer(evenement){
        const idExercice = evenement.target.closest("[data-exercice-infos]").id;

        const reponse = await fetch(`http://js-tp2:8080/backend/exercice/supprimerUn.php?id=${idExercice}`);
        const tache = await reponse.json();

        //TODO: redirection
        this.recupererToutesLesTaches();
        //TODO: popup
    }

    #cacherPanneau(){
        this.#panneauDetail.classList.add("invisible");
        this.#panneauListe.classList.add("invisible");
        this.#panneauFormulaire.classList.add("invisible");

    }

    //afficher toutes les tâches
    afficherListe(){
		this.#recupererTout();

        this.#cacherPanneau();
        this.#panneauListe.classList.remove("invisible");
    }

    //afficher la section de détails de tâche
    afficherDetail(id){
		this.#recupereUn(id);

        this.#cacherPanneau();
        this.#panneauDetail.classList.remove("invisible");

    }

    //afficher la section formulaire
    afficherFormulaire(){
        this.#cacherPanneau();
        this.#panneauFormulaire.classList.remove("invisible");

    }
}

export default App;
