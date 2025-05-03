// booster-simulator.js

const readline = require('readline');

// Prix des cartes selon leur rareté et leur tier
const cardValues = {
  Cuivre:    { Base: 1, T1: 5, T2: 30, T3: 225, T4: 2250 },
  Titane:    { Base: 2, T1: 10, T2: 60, T3: 450, T4: 4500 },
  Platine:   { Base: 5, T1: 25, T2: 150, T3: 1125, T4: 11250 },
  Améthyste: { Base: 10, T1: 50, T2: 300, T3: 2250, T4: 22500 },
  Rubis:     { Base: 20, T1: 100, T2: 600, T3: 4500, T4: 45000 },
  Or:        { Base: 50, T1: 250, T2: 1500, T3: 11250, T4: 112500 }
};

// Probabilités par défaut pour les tiers
const tierProbabilities = [
  { tier: 'Base', prob: 8878 }, // 88.78%
  { tier: 'T1', prob: 1000 },   // 10%
  { tier: 'T2', prob: 100 },    // 1%
  { tier: 'T3', prob: 20 },     // 0.2%
  { tier: 'T4', prob: 2 }       // 0.02%
];

// Tirage du tier
function drawTier() {
  const rand = Math.floor(Math.random() * 10000);
  let cumulative = 0;
  for (let {tier, prob} of tierProbabilities) {
    cumulative += prob;
    if (rand < cumulative) {
      return tier;
    }
  }
  return 'Base'; // fallback (devrait jamais arriver)
}


// Tirage d'une carte selon les probabilités fournies
function drawCard(probabilities) {
    const rand = Math.random(); // De 0 à 1 maintenant
    let cumulative = 0;
    for (let [rarity, prob] of Object.entries(probabilities)) {
      cumulative += prob;
      if (rand < cumulative) {
        return rarity;
      }
    }
    return 'Cuivre'; // fallback (devrait jamais arriver)
  }

// Calcul de la valeur d'une carte
function getCardValue(rarity) {
    const tier = drawTier();
    if (!cardValues[rarity]) {
      console.error(`Erreur: La rareté ${rarity} n'existe pas dans cardValues.`);
      return 0; // ou vous pouvez throw une erreur pour arrêter totalement
    }
    return cardValues[rarity][tier];
  }

// Simulation principale
async function simulateBooster({ boosterPrice, boosterProbabilities, trials = 100000 }) {
  const totalValues = [];

  for (let i = 0; i < trials; i++) {
    let boosterValue = 0;

    // Tirage de chaque carte du booster
    for (let cardProbs of boosterProbabilities) {
      const rarity = drawCard(cardProbs);
      const value = getCardValue(rarity);
      boosterValue += value;
    }

    totalValues.push(boosterValue);
  }

  totalValues.sort((a, b) => a - b);
  const sum = totalValues.reduce((acc, v) => acc + v, 0);
  const mean = sum / trials;
  const median = totalValues[Math.floor(trials / 2)];

  let profitable = totalValues.filter(v => v > boosterPrice).length / trials * 100;
  let profitMean = mean - boosterPrice;
  let roi = (profitMean / boosterPrice) * 100;

  // Distribution des gains
  const distribution = {
    '<1': 0,
    '1-5': 0,
    '5-10': 0,
    '10-20': 0,
    '20-50': 0,
    '50-100': 0,
    '100-250': 0,
    '250-500': 0,
    '500-1000': 0,
    '1000-2000': 0,
    '2000-5000': 0,
    '5000-10000': 0,
    '10000-20000': 0,
    '50000-100000': 0,
    '100000-500000': 0,
    '>500000': 0

  };

  for (let v of totalValues) {
    if (v < 1) distribution['<1']++;
    else if (v < 5) distribution['1-5']++;
    else if (v < 10) distribution['5-10']++;
    else if (v < 20) distribution['10-20']++;
    else if (v < 50) distribution['20-50']++;
    else if (v < 100) distribution['50-100']++;
    else if (v < 250) distribution['100-250']++;
    else if (v < 500) distribution['250-500']++;
    else if (v < 1000) distribution['500-1000']++;
    else if (v < 2000) distribution['1000-2000']++;
    else if (v < 5000) distribution['2000-5000']++;
    else if (v < 10000) distribution['5000-10000']++;
    else if (v < 20000) distribution['10000-20000']++;
    else if (v < 50000) distribution['20000-50000']++;
    else if (v < 100000) distribution['50000-100000']++;
    else if (v < 500000) distribution['100000-500000']++;
    else distribution['>500000']++;
  }

  console.log(`\nStatistiques de valeur des boosters:`);
  console.log(`Coût du booster: ${boosterPrice} pièces`);
  console.log(`Valeur moyenne: ${mean.toFixed(2)} pièces`);
  console.log(`Valeur médiane: ${median.toFixed(2)} pièces`);
  console.log(`Profit/perte moyen: ${profitMean.toFixed(2)} pièces`);
  console.log(`ROI moyen: ${roi.toFixed(2)}%`);
  console.log(`Pourcentage de boosters rentables: ${profitable.toFixed(2)}%`);

  console.log(`\nDistribution des gains:`);
  for (let [range, count] of Object.entries(distribution)) {
    const percent = (count / trials * 100).toFixed(2);
    console.log(`${range} : ${percent}% (${count} tirages)`);
  }
}

// Exemple d'utilisation:

(async () => {
    const boosterPrice = 35; // Prix du booster en pièces


    const boosterProbabilities = [
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
      ];

  await simulateBooster({ boosterPrice, boosterProbabilities });
})();




//BOOSTER 2
// { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                 // 1ère carte
// { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                 // 2ème carte
// { Cuivre: 0.91, Titane: 0.06, Platine: 0.02, Améthiste: 0.01 }, // 3ème carte
// { Cuivre: 0.46, Titane: 0.48, Platine: 0.04, Améthiste: 0.02 }, // 4ème carte
// { Titane: 0.75, Platine: 0.205, Améthiste: 0.04, Rubis: 0.005 } // 5ème carte

//BOOSTER 3
// { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 1ère carte
// { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 2ème carte
// { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 3ème carte
// { Cuivre: 0.83, Titane: 0.13, Platine: 0.02, Améthyste: 0.02 },             // 4ème carte 
// { Cuivre: 0.71, Titane: 0.20, Platine: 0.05, Améthyste: 0.03, Rubis: 0.01 },// 5ème carte
// { Titane: 0.78, Platine: 0.15, Améthyste: 0.04, Rubis: 0.015, Or: 0.005 },  // 6ème carte
// { Titane: 0.74, Platine: 0.15, Améthyste: 0.05, Rubis: 0.025, Or: 0.005 },  // 7ème carte

//BOOSTER 4
// { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 1ère carte
// { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 2ème carte
// { Cuivre: 0.94, Titane: 0.05, Platine: 0.01 },                              // 3ème carte
// { Cuivre: 0.83, Titane: 0.13, Platine: 0.02, Améthyste: 0.02 },             // 4ème carte 
// { Cuivre: 0.71, Titane: 0.20, Platine: 0.05, Améthyste: 0.03, Rubis: 0.01 },// 5ème carte
// { Titane: 0.79, Platine: 0.15, Améthyste: 0.04, Rubis: 0.015, Or: 0.005 },  // 6ème carte
// { Titane: 0.76, Platine: 0.16, Améthyste: 0.05, Rubis: 0.025, Or: 0.005 },  // 7ème carte
// { Titane: 0.56, Platine: 0.25, Améthyste: 0.133, Rubis: 0.05, Or: 0.007 },  // 8ème carte
// { Titane: 0.41, Platine: 0.32, Améthyste: 0.18, Rubis: 0.08, Or: 0.01 },    // 9ème carte
// { Platine: 0.662, Améthyste: 0.22, Rubis: 0.1, Or: 0.018 },                 // 10ème carte