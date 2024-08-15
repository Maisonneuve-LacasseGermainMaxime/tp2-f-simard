import App from "./App.js";

class Router {
    static #instance;
    #routes;

    constructor(){

        //singleton
        if (Router.#instance) {
            return Router.#instance;
        } else {
            Router.#instance = this;
        }

        this.#routes = {
            afficher: App.instance.afficherListe.bind(App.instance),
            ajouter: App.instance.afficherFormulaire.bind(App.instance),
            detail: App.instance.afficherDetail.bind(App.instance),
        };

        window.addEventListener("popstate", this.#miseAJourURL.bind(this));
        document.addEventListener("click", this.onClicLien.bind(this));

        this.#miseAJourURL();
    }

    //Permet d'accéder à l'instance de la classe de n'importe où dans le code en utilisant App.instance
    static get instance() {
        return Router.#instance;
    }

    //mise à jour de la page selon 
    #miseAJourURL() {

        //decoupage du URI (cours14)
        const url = window.location.pathname.slice(1); //On récupère l'URL sans le /
        const parts = url.split("/");
        let route = parts[0];
        let id = parts[1];



        //dispatch
        const fonctionRoute = this.#routes[route];
        console.log(fonctionRoute);
        if (id && fonctionRoute) {
            fonctionRoute(id);
        } else if (fonctionRoute) {
            fonctionRoute();
        } else {
            history.pushState({}, "", "/afficher");
			Router.instance.redirection();
        }
    }

    //modifie comportement au click d'un lien pour diriger selon le routeur
    onClicLien(evenement) {
        const elementClique = evenement.target.closest("[data-lien]");
        if (elementClique !== null) {
            evenement.preventDefault();
            const url = elementClique.href;
            history.pushState({}, "", url);

            this.#miseAJourURL();
        }
    }

    redirection(){
        this.#miseAJourURL();
    }
}

export default Router;
