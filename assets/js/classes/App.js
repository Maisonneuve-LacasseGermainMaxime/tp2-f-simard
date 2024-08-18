import Exercice from "./Exercice.js";
import Formulaire from "./Formulaire.js";
import Router from "./Router.js";
import ToastModale from "../components/ToastModale.js";

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
	#msgExerciceSuppprime;

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

		try {

			if (reponse.ok == false){
				const erreur = await reponse.json();
				throw Error (erreur.message, {cause:"database"}); //src: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

			} else {

				const exercice = await reponse.json();
				const exerciceInfos = exercice[0];

				//afficher message d'erreur et rediriger si l'exercice n'existe plus
				if (exerciceInfos == undefined) {

					const msg = "L'exercice a été supprimé";
					throw Error (msg, {cause:"supprime"});

				} else {

					const {id, type, duree, description, date, difficulte} = exerciceInfos;

					this.#detailsExerciceHTML.classList.remove("invisible");

					this.#detailsExerciceHTML.querySelector("[data-type]"). textContent = type.charAt(0).toUpperCase() + type.slice(1);
					this.#detailsExerciceHTML.querySelector("[data-duree]"). textContent = duree;
					this.#detailsExerciceHTML.querySelector("[data-date]"). textContent = date;
					this.#detailsExerciceHTML.querySelector("[data-description]"). textContent = description;
					this.#detailsExerciceHTML.querySelector("[data-difficulte]"). textContent = difficulte;
					this.#detailsExerciceHTML.id = idExercice;
	
				}

			}

		} catch(error) {

			console.log(error.cause);

			//afficher le message selon la cause de l'erreur
			if (error.cause == "database"){
				this.#afficherErreur("Une erreur est survenue");
				console.warn(error.message);
			} else {
				this.#afficherErreur(error.message);
			}

			setTimeout(() => {
				history.pushState({}, "", "/afficher");
				Router.instance.redirection();
			}, 2400);

		}

    }

    //supprimer un exercice par son id
    async #supprimer(evenement){
        const idExercice = evenement.target.closest("[data-exercice-infos]").id;

        const reponse = await fetch(`http://js-tp2:8080/backend/exercice/supprimerUn.php?id=${idExercice}`);
        console.log(reponse);

        try{
            const message = await reponse.json();
            console.log(message);

            if(reponse.ok === false) {
                throw new Error (message.message);
            }

            //afficher message de succes
            new ToastModale(message.message);

            //redirection
            history.pushState({}, "", "/afficher");
            Router.instance.redirection();

        } catch(error) {

            new ToastModale("Une erreur est survenue");
			console.error(error.message);

        }

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

	#afficherErreur(message) {
		new ToastModale(message);
	}
}

export default App;
