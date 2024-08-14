import Exercice from "./Exercice.js";
import Formulaire from "./Formulaire.js";

class App {
    static #instance;
	#exercices;
    #listeExerciceHTML;
	#detailsExerciceHTML;
    #boutonSupprimer;
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

		this.#formulaire = new Formulaire();

        //écouteur d'évènement
        this.#boutonSupprimer.addEventListener("click", this.#supprimer.bind(this));

		/*FIXME: TEST - A RETIRER*/
		this.afficherListe();
		this.afficherDetail(4);
		
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
    async #recupereUn(id){
		const reponse = await fetch(`http://js-tp2:8080/backend/exercice/lireUn.php?id=${id}`);
        const exercice = await reponse.json();

		const exerciceInfos = exercice[0];
		const {idExercice, type, duree, description, date, difficulte} = exerciceInfos;
		
		this.#detailsExerciceHTML.querySelector("[data-type]"). textContent = type.charAt(0).toUpperCase() + type.slice(1);
		this.#detailsExerciceHTML.querySelector("[data-duree]"). textContent = duree;
		this.#detailsExerciceHTML.querySelector("[data-date]"). textContent = date;
		this.#detailsExerciceHTML.querySelector("[data-description]"). textContent = description;
		this.#detailsExerciceHTML.querySelector("[data-difficulte]"). textContent = difficulte;
        this.#detailsExerciceHTML.id = id;

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

    //afficher toutes les tâches
    afficherListe(){
		this.#recupererTout();
    }

    //afficher la section de détails de tâche
    afficherDetail(id){
		this.#recupereUn(id);
    }

    //afficher la section formulaire
    afficherFormulaire(){

    }
}

export default App;
