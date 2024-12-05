import ToastModale from "../components/ToastModale";
import Router from "./Router.js";


class Formulaire {
    #formulaireHTML;
    #champsHTML;

    constructor(){
        this.#formulaireHTML = document.querySelector("[data-panneau='formulaire'] form");
		this.#champsHTML = this.#formulaireHTML.querySelectorAll("input:not([type='submit']), textarea");
		
		this.#formulaireHTML.addEventListener("submit", this.#onSubmit.bind(this));
		this.#champsHTML.forEach(function(champ){
				champ.addEventListener("blur", this.#onChangementChamp.bind(this))
			}.bind(this)
		);

    }

    //soumettre la requete HTTP
     async #onSubmit(evenement){
		evenement.preventDefault();

		const estValide = this.#validerFormulaire();

		if (estValide) {
			const body = {
				type : this.#formulaireHTML.type.value,
				date : this.#formulaireHTML.date.value,
				duree : this.#formulaireHTML.duree.value,
				description : this.#formulaireHTML.description.value,
				difficulte : this.#formulaireHTML.difficulte.value
			}

			const config = {
				method: 'POST',
				header: {
					"Content-Type":"application/json",
				},
				body: JSON.stringify(body)
			}

			try{

				const reponse = await fetch("http://js-tp2:8080/backend/exercice/ajouterUn.php", config);
				const message = await reponse.json();
				
				if(reponse.ok == false) {
					throw new Error (message.message);
				} 

				//vider formulaire 
				this.#viderFormulaire();
		
				//afficher message de succes
				this.#afficherSuccess(message.message);

				setTimeout(() => {
					history.pushState({}, "", "/afficher");
					Router.instance.redirection();
				}, 2400);

			} catch(error){
				this.#afficherErreur("Une erreur est survenue");
				console.error(error.message);
			}
		
		}

    }

	// au changement de valeur de champ, valider l'entrée et la validiter du formulaire au complet
	#onChangementChamp(evenement){
		const declencheur = evenement.currentTarget;

		this.#validerChamp(declencheur);
		this.#validerFormulaire();
	}

	// verifier que le champ ne contenient pas seulement des espaces
	#validerChamp(champ) {

		let estValide = champ.checkValidity();

		if (champ.type != "radio") {
			
			if (estValide) {
				estValide = champ.value.trim().length >= 1;
			}

			const messageErreur = champ.closest(".input-group").querySelector("p");

			if (estValide) {
				messageErreur.classList.add("invisible");
				return true;
			} else if ( champ.type == 'datetime-local')	{
				messageErreur.classList.remove('invisible');
				return false;
			} else if ( champ.value.length == 0 ) {
				messageErreur.classList.add("invisible");
				return false;
			}
			else {
				messageErreur.classList.remove("invisible");
				return false;
			}
		}

	}

    //valider le formulaire au complet
    #validerFormulaire(){

		const estValide = this.#formulaireHTML.checkValidity();

		this.#formulaireHTML.querySelector("input[type='submit']").classList.toggle("disabled", !estValide);
		return estValide;
    }

    //afficher message de succes de soumission à la base de données
    #afficherSuccess(message){
		new ToastModale(message);
    }

    //afficher les message d'erreur de soumission à la base de données
    #afficherErreur(message){
		new ToastModale(message);
    }

    //vider le formulaire
    #viderFormulaire(){
        this.#formulaireHTML.reset();
    }
}

export default Formulaire;