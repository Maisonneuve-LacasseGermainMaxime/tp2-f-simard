import Exercice from "./Exercice.js";

class App {
    static #instance;
	#exercices;
    #listeExerciceHTML;
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

		this.#listeExerciceHTML = document.querySelector("[data-liste-exercices]");

		/*TEST*/
		this.afficherListe();
    }

    //récupérer toutes les tâches
    async #recupererTout(){
		const reponse = await fetch("http://localhost:8080/tp2-f-simard/backend/exercice/lireTout.php");
        const exercices = await reponse.json();

        this.#exercices = [];
        this.#listeExerciceHTML.innerHTML = "";

        exercices.forEach((exercice) => {
            this.#exercices.push(exercice);
            new Exercice(exercice, this.#listeExerciceHTML);
        });
    }

    //récupérer une tâche selon son ID
    #recupereUn(id){

    }

    // ajouter un exercice à la base de donnée
    #ajouter(infos){

    }

    //supprimer un exercice par son id
    #supprimer(id){

    }

    //afficher toutes les tâches
    afficherListe(){
		console.log('afficher liste');
		this.#recupererTout();
    }

    //afficher la section de détails de tâche
    afficherDetail(){

    }

    //afficher la section formulaire
    afficherFormulaire(){

    }
}

export default App;
