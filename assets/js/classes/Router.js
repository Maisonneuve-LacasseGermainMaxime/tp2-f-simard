import App from "./App.js";

class Router {
    #routes;

    constructor(){
        this.#routes = {
            afficher: App.instance.afficherListe.bind(App.instance),
            ajouter: App.instance.afficherFormulaire.bind(App.instance),
            detail: App.instance.afficherDetail.bind(App.instance),
        };

        window.addEventListener("popstate", this.#miseAJourURL.bind(this));
        document.addEventListener("click", this.onClicLien.bind(this));

        this.#miseAJourURL();
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
        if (id) {
            fonctionRoute(id);
        } else if (fonctionRoute) {
            fonctionRoute();
        } else {
            this.#routes["afficher"]();
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
}

export default Router;
