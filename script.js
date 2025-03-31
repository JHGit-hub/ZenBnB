
// Déclaration des boutons
let buttonNoFilter = document.getElementById("no-filter");
let buttonSea = document.getElementById("sea");
let buttonLight = document.getElementById("light");
let buttonSpace = document.getElementById("space");
let buttonRomantic = document.getElementById("romantic");
let buttonInternet = document.getElementById("internet");
let logementListe = document.getElementById("logements-list");
logementListe.style.display = "none"


// function reset
function reset(){
    const divResult = document.getElementById("result");
    const divSummary = document.getElementById("summary");
    const dietSection = document.getElementById("dietSection");
    const radio = document.querySelectorAll('input[type="radio"]');
    let logementListe = document.getElementById("logements-list");
    radio.forEach(radio => radio.checked = false);        
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    divResult.innerHTML = "";
    divSummary.innerHTML = "";
    document.getElementById("form").reset();
    logementListe.style.display = "none";
    dietSection.style.display = "none";

    document.getElementById("reset-btn").addEventListener("click", reset);
}


// Récupération des données
fetch("zenbnb.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Le fichier JSON n'a pas pu être chargé.");
        }
        return response.json();
    })
    .then(data => {
        logementListe = document.getElementById("logements-list");

// function afficherLogements
        function afficherLogements(logements) {
            logementListe.innerHTML = ""; // Réinitialise la liste
            logements.forEach(logement => {
                let container = document.createElement("div");
                
                // Création des éléments
                let title = document.createElement("h2");
                title.textContent = "Titre: " + logement.title;
                
                let city = document.createElement("h2");
                city.textContent = "Ville: " + logement.city;
                
                let description = document.createElement("p");
                description.textContent = "Description: " + logement.description;
                
                let rating = document.createElement("p");
                rating.textContent = "Note: " + logement.rating;
                
                let price = document.createElement("p");
                price.textContent = "Prix par Nuit: " + logement.price_per_night + " €";
                
                let wifi = document.createElement("div");
                wifi.innerHTML = logement.wifi 
                    ? "wifi <img src='assets/images/green-check.png'>" 
                    : "wifi <img src='assets/images/red-cross.png'>";
                
                let star = document.createElement("div");
                if (logement.superhost) {
                    star.innerHTML = "Superhost <img src='assets/images/star.png'>";
                }
                
                let tags = document.createElement("p");
                tags.textContent = "Tags: " + logement.tags.join(", "); // Affichage des tags
                
                // Ajout des éléments au container
                container.appendChild(title);
                container.appendChild(city);
                container.appendChild(description);
                container.appendChild(rating);
                container.appendChild(price);
                container.appendChild(wifi);
                container.appendChild(star);
                container.appendChild(tags);
                
                logementListe.appendChild(container);
            });
        }

        // Affichage initial (tous les logements)
        afficherLogements(data.listings);

        // Filtrage des logements
        function filtrerLogements(critere) {
            if (critere === "no-filter") {
                afficherLogements(data.listings);
            } else if (critere === "internet") {
                afficherLogements(data.listings.filter(logement => logement.wifi === true));
            } else {
                afficherLogements(data.listings.filter(logement => logement.tags.includes(critere)));
            }
        }

        // Ajout des événements aux boutons
        buttonNoFilter.addEventListener("click", () => {
            filtrerLogements("no-filter");
            logementListe.style.display ="block";
        });
        buttonSea.addEventListener("click", () => filtrerLogements("vue mer"));
        buttonLight.addEventListener("click", () => filtrerLogements("lumineux"));
        buttonSpace.addEventListener("click", () => filtrerLogements("spacieux"));
        buttonRomantic.addEventListener("click", () => filtrerLogements("romantique"));
        buttonInternet.addEventListener("click", () => filtrerLogements("internet"));


// regime alimentaire

        document.getElementById("petit_dejeuner").addEventListener("change", toggleDiet);
        document.getElementById("dejeuner").addEventListener("change", toggleDiet);
        document.getElementById("diner").addEventListener("change", toggleDiet);
        dietSection.style.display = "none";

        function toggleDiet(){
            const petitDejeuner = document.getElementById("petit_dejeuner").checked;
            const dejeuner = document.getElementById("dejeuner").checked;
            const diner = document.getElementById("diner").checked;
            if(petitDejeuner || dejeuner || diner){
                dietSection.style.display = "flex";
                console.log("dietSection est AFFICHÉE");
            } else {
                dietSection.style.display = "none";
                console.log("dietSection est MASQUÉE");
            }
        }

// recuperation des informations du formulaire
        document.getElementById("form").addEventListener("submit",function(e){
            e.preventDefault();

// creation des constantes
            const nom = document.getElementById("nom").value.trim();
            const prenom = document.getElementById("prenom").value.trim();
            const adresse = document.getElementById("adresse").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const logementMaison = document.getElementById("logementMaison").checked;
            const logementAppartement = document.getElementById("logementAppartement").checked;
            const petitDejeuner = document.getElementById("petit_dejeuner").checked;
            const dejeuner = document.getElementById("dejeuner").checked;
            const diner = document.getElementById("diner").checked;
            const arrivee = document.getElementById("arrivee").value;
            const depart = document.getElementById("depart").value;
            const peopleValue = document.getElementById("people").value.trim();
            const chauffeur = document.getElementById("chauffeur").checked;
            const guide = document.getElementById("guide").checked;
            const piscine = document.getElementById("piscine").checked;
            const romantique = document.getElementById("romantique").checked;
            const lumineux = document.getElementById("lumineux").checked;
            const vueSurMer = document.getElementById("vueSurMer").checked;
            const wifiOption = document.getElementById("wifiOption").checked;
            const divResult = document.getElementById("result");
            const divSummary = document.getElementById("summary");

            const logement = logementMaison ? "Maison" : logementAppartement ? "Appartement" : null; // condition si logementMaison est checked, alors const logement = "Maison",
// sinon appartement, sinon null

            const dietType = document.querySelector('input[name="diet"]:checked') ? document.querySelector('input[name="diet"]:checked').value : "Aucun";
// condition sur le input du name "diet"; si une selection, on lui donne la value, sinon, aucun

            let arriveeDate = new Date(arrivee);
            let arriveeFormatted = arriveeDate.toLocaleDateString('fr-FR');
            let departDate = new Date(depart);
            let departFormatted = departDate.toLocaleDateString('fr-FR');


// tableau de stockage d'erreurs
            let errors =[];


// condition Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{9,12}$/;


// verification des champs
            if(nom.length <2 || nom.length>50)
                errors.push("Le nom doit contenir entre 2 et 50 caractéres");

            if(prenom.length <2 || prenom.length>50)
                errors.push("Le prénom doit contenir entre 2 et 50 caractéres");

            if(adresse.length<5 || adresse.length>100)
                errors.push("L'adresse doit contenir entre 5 et 100 caractéres");

            if(!emailRegex.test(email))
                errors.push("Email non valide");

            if(!phoneRegex.test(phone))
                errors.push("Tèlèphone non valide");

            if(!logement)
                errors.push("Vous devez choisir un type de logement");

            if(!arrivee)
                errors.push("choisissez une date d'arrivée");

            if(!depart)
                errors.push("choisissez une date de départ");

            if(depart<arrivee || depart === arrivee)
                errors.push("les dates ne conviennent pas");

            if(!petitDejeuner && !chauffeur && !guide && !piscine
                && !dejeuner && !diner 
                && !romantique && !lumineux && !vueSurMer && !wifiOption)
                errors.push("Vous devez choisir au moins une option")

            let people = null;
            if(peopleValue === ""){
                errors.push("Veuillez indiquer le nombre de personnes")
            }else {
                people = parseInt(peopleValue);
                if(people<0 || people>10){
                errors.push("Vous devez être entre 1 et 10 personnes")
                }
            };

            divResult.innerHTML = errors.length>0 ? errors.join("<br>") : "Enregistrement validé";
            divSummary.innerHTML = errors.length === 0 ? 
                `Logement choisi: ${logement} <br>
                date d'arrivée: ${arriveeFormatted} <br>
                date de départ: ${departFormatted} <br>
                nombre de personnes: ${people} <br>
                régime alimentaire: ${dietType}<br>
                options choisis: ${optionsChoisis()}` :
                "Modifiez votre enregistrement";


// function résumé des options
            function optionsChoisis(){
                let options = [];
                if(chauffeur) options.push("Chauffeur");
                if(diner) options.push("Dîner");
                if(dejeuner) options.push("Déjeuner");
                if(petitDejeuner) options.push("Petit Déjeuner");
                if(guide) options.push("Guide");
                if(piscine) options.push("Piscine");
                if(romantique) options.push("Romantique");
                if(lumineux) options.push("Lumineux");
                if(vueSurMer) options.push("Vue sur mer");
                if(wifiOption) options.push("Wifi");

                return options.length>0 ? options.join(", ") : "Aucune options choisis"
            }

// filtre selon critéres cochés
            if(vueSurMer) filtrerLogements("vue mer");
            if(lumineux) filtrerLogements("lumineux");
            if(romantique) filtrerLogements("romantique");
            if(wifiOption) filtrerLogements("internet");
        })
    });

