class Exercice {
    #id;
    #type;
    #date;
    #duree;
    #description;
    #difficulte;
    #gabarit;
    #conteneurHTML;
	#elementHTML;

    constructor(exerciceInfos, conteneurHTML){
		const {id, type, duree, description, date, difficulte} = exerciceInfos;

        this.#id = id;

		// mettre la première lettre en majuscule
		// src: https://www.shecodes.io/athena/3710-how-to-capitalize-the-first-letter-in-a-string-with-javascript
        this.#type = type.charAt(0).toUpperCase() + type.slice(1);;

        this.#date = date;
		this.#duree = duree;
        this.#description = description;
        this.#difficulte = difficulte;
        this.#gabarit = document.querySelector("#exercice");
        this.#conteneurHTML = conteneurHTML;

        this.#injecterHTML();
    }

    //injecter Exercice dans le HTMl à partir d'un gabarit
    #injecterHTML(){
		let clone = this.#gabarit.content.cloneNode(true);

		this.#conteneurHTML.appendChild(clone);
		this.#elementHTML = this.#conteneurHTML.lastElementChild;

		this.#elementHTML.innerHTML = this.#elementHTML.innerHTML.replace(/{{date}}/g, this.#date);
		this.#elementHTML.innerHTML = this.#elementHTML.innerHTML.replace(/{{type}}/g, this.#type);
    }
}

export default Exercice;