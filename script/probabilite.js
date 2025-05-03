// probabilite.js

const raretesBoosters = {
  1: [
    { Cuivre: 0.92, Titane: 0.07, Platine: 0.01 },
    { Cuivre: 0.9, Titane: 0.07, Platine: 0.02, Améthyste: 0.01 },
    { Cuivre: 0.43, Titane: 0.5, Platine: 0.05, Améthyste: 0.02 }
  ],
  2: [
    { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                 // 1ère carte
    { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                 // 2ème carte
    { Cuivre: 0.91, Titane: 0.06, Platine: 0.02, Améthyste: 0.01 }, // 3ème carte
    { Cuivre: 0.46, Titane: 0.48, Platine: 0.04, Améthyste: 0.02 }, // 4ème carte
    { Titane: 0.75, Platine: 0.205, Améthyste: 0.04, Rubis: 0.005 } // 5ème carte
  ],
  3: [
    { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 1ère carte
    { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 2ème carte
    { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 3ème carte
    { Cuivre: 0.83, Titane: 0.13, Platine: 0.02, Améthyste: 0.02 },             // 4ème carte 
    { Cuivre: 0.71, Titane: 0.20, Platine: 0.05, Améthyste: 0.03, Rubis: 0.01 },// 5ème carte
    { Titane: 0.78, Platine: 0.15, Améthyste: 0.05, Rubis: 0.015, Or: 0.005 },  // 6ème carte
    { Titane: 0.74, Platine: 0.16, Améthyste: 0.07, Rubis: 0.025, Or: 0.005 }   // 7ème carte
  ],
  4: [
    { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 1ère carte
    { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 2ème carte
    { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 3ème carte
    { Cuivre: 0.83, Titane: 0.13, Platine: 0.02, Améthyste: 0.02 },             // 4ème carte 
    { Cuivre: 0.71, Titane: 0.20, Platine: 0.05, Améthyste: 0.03, Rubis: 0.01 },// 5ème carte
    { Titane: 0.79, Platine: 0.15, Améthyste: 0.04, Rubis: 0.015, Or: 0.005 },  // 6ème carte
    { Titane: 0.76, Platine: 0.16, Améthyste: 0.05, Rubis: 0.025, Or: 0.005 },  // 7ème carte
    { Titane: 0.56, Platine: 0.25, Améthyste: 0.133, Rubis: 0.05, Or: 0.007 },  // 8ème carte
    { Titane: 0.41, Platine: 0.32, Améthyste: 0.18, Rubis: 0.08, Or: 0.01 },    // 9ème carte
    { Platine: 0.662, Améthyste: 0.22, Rubis: 0.1, Or: 0.018 },                 // 10ème carte
  ],
};

const tiers = {
  Normal: 0.8878,
  T1: 0.1,
  T2: 0.01,
  T3: 0.002,
  T4: 0.0002
};

const plagesID = {
  Cuivre: { min: 1, max: 50 },
  Titane: { min: 51, max: 72 },
  Platine: { min: 73, max: 85 },
  Améthyste: { min: 86, max: 93 },
  Rubis: { min: 94, max: 97 },
  Or: { min: 98, max: 100 }
};

function obtenirRarete(raretes) {
  const nombreAleatoire = Math.random();
  let somme = 0;
  for (const rarete in raretes) {
    somme += raretes[rarete];
    if (nombreAleatoire <= somme) {
      return rarete;
    }
  }
  throw new Error("Erreur dans les pourcentages de rareté");
}

function obtenirTiers() {
  const nombreAleatoire = Math.random();
  let somme = 0;
  for (const tier in tiers) {
    somme += tiers[tier];
    if (nombreAleatoire <= somme) {
      return tier;
    }
  }
  throw new Error("Erreur dans les pourcentages de tier");
}

function tirerIdSelonRarete(rarete) {
  const plage = plagesID[rarete];
  if (!plage) {
    throw new Error(`Pas de plage définie pour la rareté : ${rarete}`);
  }
  const idTire = Math.floor(Math.random() * (plage.max - plage.min + 1)) + plage.min;
  return idTire;
}

// Fonction principale flexible
function calculerCartes(numBooster = 1) {
  const booster = raretesBoosters[numBooster];

  if (!booster) {
    throw new Error(`Booster numéro ${numBooster} introuvable.`);
  }

  const cartes = [];
  for (const raretes of booster) {
    const tier = obtenirTiers();
    const rareteObtenue = obtenirRarete(raretes);
    const idCarte = tirerIdSelonRarete(rareteObtenue);
    cartes.push({ tier, rarete: rareteObtenue, idCarte });
  }
  return cartes;
}

module.exports = { calculerCartes };
