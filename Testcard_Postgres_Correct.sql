
DROP TABLE IF EXISTS cartes;
CREATE TABLE cartes (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  rarete INTEGER NOT NULL,
  description TEXT,
  image_url VARCHAR(255)
);

INSERT INTO cartes VALUES 
(1,'Teckel électricien',1,'Teckel avec des compétences en électricité','./img_Cartes/Teckel-0-01.webp'),
(2,'Teckel plombier',1,'Teckel spécialisé en plomberie','./img_Cartes/Teckel-0-02.webp');
-- [Raccourci pour exemple : à compléter avec toutes les cartes]

DROP TABLE IF EXISTS utilisateurs;
CREATE TABLE utilisateurs (
  id SERIAL PRIMARY KEY,
  pseudo VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  jetons INTEGER NOT NULL DEFAULT 10,
  dernier_gain TIMESTAMP,
  tentatives INTEGER DEFAULT 0,
  verrouillage TIMESTAMP,
  prochaine_recolte TIMESTAMP
);

INSERT INTO utilisateurs VALUES
(1, 'admin', 'admin@gmail.com', '$2y$10$hash', 1000, NULL, 0, NULL, NULL);

DROP TABLE IF EXISTS collections;
CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  utilisateur_id INTEGER NOT NULL,
  carte_id INTEGER NOT NULL,
  nb_exemplaires INTEGER DEFAULT 1,
  nb_brillante INTEGER DEFAULT 0,
  nb_alternative INTEGER DEFAULT 0,
  nb_noir_blanc INTEGER DEFAULT 0,
  nb_gold INTEGER DEFAULT 0,
  CONSTRAINT unique_utilisateur_carte UNIQUE (utilisateur_id, carte_id),
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (carte_id) REFERENCES cartes(id) ON DELETE CASCADE
);

-- INSERT collections exemple :
INSERT INTO collections (utilisateur_id, carte_id, nb_exemplaires) VALUES
(1, 1, 2), (1, 2, 1);

DROP TABLE IF EXISTS ventes;
CREATE TABLE ventes (
  id SERIAL PRIMARY KEY,
  vendeur_id INTEGER NOT NULL,
  carte_id INTEGER NOT NULL,
  quantite INTEGER NOT NULL DEFAULT 1,
  prix_par_unite INTEGER NOT NULL,
  type VARCHAR(50) DEFAULT 'basique',
  date_vente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendeur_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (carte_id) REFERENCES cartes(id)
);

-- INSERT ventes exemple :
INSERT INTO ventes (vendeur_id, carte_id, quantite, prix_par_unite, type) VALUES
(1, 1, 1, 3, 'basique');
