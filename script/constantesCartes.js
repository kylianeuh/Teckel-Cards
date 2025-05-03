// 🎴 Constantes communes pour les cartes


const prixVente = {
  1: { T0: 1, T1: 5, T2: 30, T3: 225, T4: 2250 },
  2: { T0: 2, T1: 10, T2: 60, T3: 450, T4: 4500 },
  3: { T0: 5, T1: 25, T2: 150, T3: 1125, T4: 11250 },
  4: { T0: 10, T1: 50, T2: 300, T3: 2250, T4: 22500 },
  5: { T0: 20, T1: 100, T2: 600, T3: 4500, T4: 45000 },
  6: { T0: 50, T1: 250, T2: 1500, T3: 11250, T4: 112500 }
};

const rarityNames = {
  1: "Cuivre",
  2: "Titane",
  3: "Platine",
  4: "Améthyste",
  5: "Rubis",
  6: "Or"
};

const rarityLetters = {
  1: "C",
  2: "T",
  3: "P",
  4: "A",
  5: "R",
  6: "G"
};

const color1 = {
  1: "#b87333",
  2: "#b0c4de",
  3: "#e5e4e2",
  4: "#9966cc",
  5: "#e0115f",
  6: "#ffd700"
};

const color2 = {
  1: "#e6c3a1",
  2: "#e6e6f0",
  3: "#fafafa",
  4: "#d1b3e0",
  5: "#f8c2d4",
  6: "#fff9d6"
};

const color3 = {
  1: "rgba(184, 115, 51, 0.8)",
  2: "rgba(176, 196, 222, 0.8)",
  3: "rgba(229, 228, 226, 0.8)",
  4: "rgba(153, 102, 204, 0.8)",
  5: "rgba(224, 17, 95, 0.8)",
  6: "rgba(255, 215, 0, 0.8)"
};

const mapTier = {
  nb_exemplaires: 'T0',
  nb_brillante: 'T1',
  nb_alternative: 'T2',
  nb_noir_blanc: 'T3',
  nb_gold: 'T4'
};

module.exports = {
  prixVente,
  rarityNames,
  rarityLetters,
  color1,
  color2,
  color3,
  mapTier,
  taillesSeries: [100, 20],
};