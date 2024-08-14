class Formulaire {
    #formulaireHTML;
    #champsHTML;

    constructor(){
        this.#formulaireHTML = document.querySelector("[data-panneau='formulaire'] form");
		this.#champsHTML = this.#formulaireHTML.querySelectorAll("input:not([type='submit']), textarea");
		console.log(this.#champsHTML);
		
		this.#formulaireHTML.addEventListener("submit", this.#onSubmit.bind(this));
		this.#champsHTML.forEach(function(champ){
				champ.addEventListener("change", this.#onChangementChamp.bind(this))
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

			const reponse = await fetch("http://js-tp2:8080/backend/exercice/ajouterUn.php", config);

			const message = await reponse.json();
			console.log(message);

			//vider formulaire 
			this.#viderFormulaire();

			// TODO: routeur, redirection

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

		const messageErreur = champ.closest(".input-group").querySelector("p");

		let estValide = champ.checkValidity();

		if (champ.type != "radio") {
			if (estValide) {
				estValide = champ.value.trim().length >= 1;
			}
		}

		if (estValide) {
			messageErreur.classList.add("invisible");
			return true;
		} else if ( champ.value.length == 0 ) {
			messageErreur.classList.add("invisible");
			return false;
		}
		else {
			messageErreur.classList.remove("invisible");
			return false;
		}

	}

    //valider le formulaire au complet
    #validerFormulaire(){

		let validateChamp = [];
		this.#champsHTML.forEach(function(champ){
			validateChamp.push(this.#validerChamp(champ));
		}.bind(this));


		//formulaire valide si ne trouve pas de "false" dans le tableau de validation
		const estValide = !validateChamp.includes(false);

		if (estValide) {
			this.#formulaireHTML.querySelector("input[type='submit']").classList.remove("disabled");
		}
		return estValide;
    }

    //afficher message de succes de soumission à la base de données
    #afficherSuccess(){

    }

    //afficher les message d'erreur de soumission à la base de données
    #afficherErreur(){

    }

    //vider le formulaire
    #viderFormulaire(){
        this.#formulaireHTML.reset();
    }
}

export default Formulaire;