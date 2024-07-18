class App {
    static #instance;
    #listeExercice;
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
    }

    //récupérer toutes les tâches
    #recupererTout(){

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

    }

    //afficher la section de détails de tâche
    afficherDetail(){

    }

    //afficher la section formulaire
    afficherFormulaire(){

    }
}

export default App;
