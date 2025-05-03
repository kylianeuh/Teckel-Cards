-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : sam. 26 avr. 2025 à 16:00
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `testcard`
--

-- --------------------------------------------------------

--
-- Structure de la table `cartes`
--

CREATE TABLE `cartes` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `rarete` tinyint(5) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cartes`
--

INSERT INTO `cartes` (`id`, `nom`, `rarete`, `description`, `image_url`) VALUES
(1, 'Teckel électricien', 1, 'Teckel avec des compétences en électricité', './img_Cartes/Teckel_1.webp'),
(2, 'Teckel plombier', 1, 'Teckel spécialisé en plomberie', './img_Cartes/Teckel_2.webp'),
(3, 'Teckel mécanicien', 1, 'Teckel expert en mécanique', './img_Cartes/Teckel_3.webp'),
(4, 'Teckel boulanger', 1, 'Teckel qui aime faire du pain', './img_Cartes/Teckel_4.webp'),
(5, 'Teckel pâtissier', 1, 'Teckel talentueux en pâtisserie', './img_Cartes/Teckel_5.webp'),
(6, 'Teckel comptable', 1, 'Teckel excellent avec les chiffres', './img_Cartes/Teckel_6.webp'),
(7, 'Teckel banquier', 1, 'Teckel avec une expertise bancaire', './img_Cartes/Teckel_7.webp'),
(8, 'Teckel bibliothécaire', 1, 'Teckel passionné par les livres', './img_Cartes/Teckel_8.webp'),
(9, 'Teckel jardinier', 1, 'Teckel qui aime entretenir les jardins', './img_Cartes/Teckel_9.webp'),
(10, 'Teckel agriculteur', 1, 'Teckel qui cultive la terre', './img_Cartes/Teckel_10.webp'),
(11, 'Teckel fermier', 1, 'Teckel travaillant dans une ferme', './img_Cartes/Teckel_11.webp'),
(12, 'Teckel pêcheur', 1, 'Teckel habile à attraper des poissons', './img_Cartes/Teckel_12.webp'),
(13, 'Teckel forgeron', 1, 'Teckel expert en forge', './img_Cartes/Teckel_13.webp'),
(14, 'Teckel charpentier', 1, 'Teckel compétent en charpenterie', './img_Cartes/Teckel_14.webp'),
(15, 'Teckel maçon', 1, 'Teckel bâtisseur', './img_Cartes/Teckel_15.webp'),
(16, 'Teckel ébéniste', 1, 'Teckel travailleur du bois', './img_Cartes/Teckel_16.webp'),
(17, 'Teckel coiffeur', 1, 'Teckel styliste pour poils', './img_Cartes/Teckel_17.webp'),
(18, 'Teckel magicien', 1, 'Teckel aux talents magiques', './img_Cartes/Teckel_18.webp'),
(19, 'Teckel réceptionniste', 1, 'Teckel expert en accueil', './img_Cartes/Teckel_19.webp'),
(20, 'Teckel secrétaire', 1, 'Teckel qui gère les documents', './img_Cartes/Teckel_20.webp'),
(21, 'Teckel étudiant', 1, 'Teckel en pleine formation', './img_Cartes/Teckel_21.webp'),
(22, 'Teckel coach sportif', 1, 'Teckel qui motive les autres', './img_Cartes/Teckel_22.webp'),
(23, 'Teckel esthéticien', 1, 'Teckel spécialiste en beauté', './img_Cartes/Teckel_23.webp'),
(24, 'Teckel concierge', 1, 'Teckel toujours au service', './img_Cartes/Teckel_24.webp'),
(25, 'Teckel barman', 1, 'Teckel qui prépare les boissons', './img_Cartes/Teckel_25.webp'),
(26, 'Teckel barista', 1, 'Teckel spécialiste des cafés', './img_Cartes/Teckel_26.webp'),
(27, 'Teckel chocolatier', 1, 'Teckel expert en chocolat', './img_Cartes/Teckel_27.webp'),
(28, 'Teckel fleuriste', 1, 'Teckel amoureux des fleurs', './img_Cartes/Teckel_28.webp'),
(29, 'Teckel sculpteur', 1, 'Teckel artiste talentueux', './img_Cartes/Teckel_29.webp'),
(30, 'Teckel photographe', 1, 'Teckel capturant des moments', './img_Cartes/Teckel_30.webp'),
(31, 'Teckel peintre', 1, 'Teckel passionné par l\'art', './img_Cartes/Teckel_31.webp'),
(32, 'Teckel écrivain', 1, 'Teckel maître des mots', './img_Cartes/Teckel_32.webp'),
(33, 'Teckel journaliste', 1, 'Teckel informateur', './img_Cartes/Teckel_33.webp'),
(34, 'Teckel linguiste', 1, 'Teckel expert en langues', './img_Cartes/Teckel_34.webp'),
(35, 'Teckel interprète', 1, 'Teckel facilitant la communication', './img_Cartes/Teckel_35.webp'),
(36, 'Teckel traducteur', 1, 'Teckel maître des traductions', './img_Cartes/Teckel_36.webp'),
(37, 'Teckel guide touristique', 1, 'Teckel explorateur', './img_Cartes/Teckel_37.webp'),
(38, 'Teckel mannequin', 1, 'Teckel élégant', './img_Cartes/Teckel_38.webp'),
(39, 'Teckel danseur', 1, 'Teckel qui bouge avec style', './img_Cartes/Teckel_39.webp'),
(40, 'Teckel DJ', 1, 'Teckel maître du mix', './img_Cartes/Teckel_40.webp'),
(41, 'Teckel acteur', 1, 'Teckel qui brille sur scène', './img_Cartes/Teckel_41.webp'),
(42, 'Teckel chanteur', 1, 'Teckel à la belle voix', './img_Cartes/Teckel_42.webp'),
(43, 'Teckel réalisateur', 1, 'Teckel derrière la caméra', './img_Cartes/Teckel_43.webp'),
(44, 'Teckel couturier', 1, 'Teckel créateur de mode', './img_Cartes/Teckel_44.webp'),
(45, 'Teckel styliste', 1, 'Teckel spécialiste des looks', './img_Cartes/Teckel_45.webp'),
(46, 'Teckel bijoutier', 1, 'Teckel créateur de bijoux', './img_Cartes/Teckel_46.webp'),
(47, 'Teckel agent immobilier', 1, 'Teckel expert en biens', './img_Cartes/Teckel_47.webp'),
(48, 'Teckel pharmacien', 1, 'Teckel dans la santé', './img_Cartes/Teckel_48.webp'),
(49, 'Teckel dentiste', 1, 'Teckel qui soigne les dents', './img_Cartes/Teckel_49.webp'),
(50, 'Teckel vétérinaire', 1, 'Teckel au service des animaux', './img_Cartes/Teckel_50.webp'),
(51, 'Teckel médecin', 2, 'Teckel qui soigne les humains', './img_Cartes/Teckel_51.webp'),
(52, 'Teckel professeur', 2, 'Teckel qui enseigne', './img_Cartes/Teckel_52.webp'),
(53, 'Teckel psychanalyste', 2, 'Teckel à l\'écoute', './img_Cartes/Teckel_53.webp'),
(54, 'Teckel psychologue', 2, 'Teckel qui analyse les émotions', './img_Cartes/Teckel_54.webp'),
(55, 'Teckel militaire', 2, 'Teckel courageux', './img_Cartes/Teckel_55.webp'),
(56, 'Teckel pilote', 2, 'Teckel au commande d\'un avion', './img_Cartes/Teckel_56.webp'),
(57, 'Teckel capitaine de bateau', 2, 'Teckel des mers', './img_Cartes/Teckel_57.webp'),
(58, 'Teckel météorologue', 2, 'Teckel qui analyse la météo', './img_Cartes/Teckel_58.webp'),
(59, 'Teckel historien', 2, 'Teckel passionné par l\'histoire', './img_Cartes/Teckel_59.webp'),
(60, 'Teckel archéologue', 2, 'Teckel explorateur du passé', './img_Cartes/Teckel_60.webp'),
(61, 'Teckel anthropologue', 2, 'Teckel qui étudie les sociétés', './img_Cartes/Teckel_61.webp'),
(62, 'Teckel sociologue', 2, 'Teckel observateur des relations humaines', './img_Cartes/Teckel_62.webp'),
(63, 'Teckel policier', 2, 'Teckel gardien de l\'ordre', './img_Cartes/Teckel_63.webp'),
(64, 'Teckel enquêteur', 2, 'Teckel résolvant des mystères', './img_Cartes/Teckel_64.webp'),
(65, 'Teckel agent de sécurité', 2, 'Teckel protégeant les biens et les personnes', './img_Cartes/Teckel_65.webp'),
(66, 'Teckel guide de montagne', 2, 'Teckel des sommets', './img_Cartes/Teckel_66.webp'),
(67, 'Teckel maître d\'hôtel', 2, 'Teckel au service des clients', './img_Cartes/Teckel_67.webp'),
(68, 'Teckel entraîneur', 2, 'Teckel qui motive et accompagne', './img_Cartes/Teckel_68.webp'),
(69, 'Teckel géologue', 2, 'Teckel explorant la Terre', './img_Cartes/Teckel_69.webp'),
(70, 'Teckel botaniste', 2, 'Teckel expert des plantes', './img_Cartes/Teckel_70.webp'),
(71, 'Teckel zoologiste', 2, 'Teckel passionné par les animaux', './img_Cartes/Teckel_71.webp'),
(72, 'Teckel retraité', 2, 'Teckel profitant de la vie', './img_Cartes/Teckel_72.webp'),
(73, 'Teckel architecte', 3, 'Teckel bâtisseur de rêves', './img_Cartes/Teckel_73.webp'),
(74, 'Teckel économiste', 3, 'Teckel en gestion financière', './img_Cartes/Teckel_74.webp'),
(75, 'Teckel mathématicien', 3, 'Teckel expert en mathématiques', './img_Cartes/Teckel_75.webp'),
(76, 'Teckel ingénieur', 3, 'Teckel inventeur talentueux', './img_Cartes/Teckel_76.webp'),
(77, 'Teckel statisticien', 3, 'Teckel maître des chiffres', './img_Cartes/Teckel_77.webp'),
(78, 'Teckel philosophe', 3, 'Teckel penseur réfléchi', './img_Cartes/Teckel_78.webp'),
(79, 'Teckel diplomate', 3, 'Teckel représentant son pays', './img_Cartes/Teckel_79.webp'),
(80, 'Teckel linguiste', 3, 'Teckel expert en langues', './img_Cartes/Teckel_80.webp'),
(81, 'Teckel juge', 3, 'Teckel qui rend la justice', './img_Cartes/Teckel_81.webp'),
(82, 'Teckel procureur', 3, 'Teckel défenseur des lois', './img_Cartes/Teckel_82.webp'),
(83, 'Teckel contrôleur aérien', 3, 'Teckel guidant les avions', './img_Cartes/Teckel_83.webp'),
(84, 'Teckel parfumeur', 3, 'Teckel créateur de fragrances', './img_Cartes/Teckel_84.webp'),
(85, 'Teckel ostéopathe', 3, 'Teckel guérissant les douleurs', './img_Cartes/Teckel_85.webp'),
(86, 'Teckel avocat', 4, 'Teckel expert en droit', './img_Cartes/Teckel_86.webp'),
(87, 'Teckel détective privé', 4, 'Teckel résolvant des affaires complexes', './img_Cartes/Teckel_87.webp'),
(88, 'Teckel astrophysicien', 4, 'Teckel explorateur des étoiles', './img_Cartes/Teckel_88.webp'),
(89, 'Teckel magistrat', 4, 'Teckel garant de la loi', './img_Cartes/Teckel_89.webp'),
(90, 'Teckel bijoutier', 4, 'Teckel créateur de pièces uniques', './img_Cartes/Teckel_90.webp'),
(91, 'Teckel chocolatier', 4, 'Teckel maître du chocolat', './img_Cartes/Teckel_91.webp'),
(92, 'Teckel écrivain renommé', 4, 'Teckel célèbre pour ses écrits', './img_Cartes/Teckel_92.webp'),
(93, 'Teckel chef cuisinier étoilé', 4, 'Teckel étoile de la gastronomie', './img_Cartes/Teckel_93.webp'),
(94, 'Teckel chef cuisinier', 5, 'Teckel maître des saveurs', './img_Cartes/Teckel_94.webp'),
(95, 'Teckel sommelier', 5, 'Teckel expert en vins et spiritueux', './img_Cartes/Teckel_95.webp'),
(96, 'Teckel maître d\'hôtel de prestige', 5, 'Teckel au service des plus grands', './img_Cartes/Teckel_96.webp'),
(97, 'Teckel magistrat', 5, 'Teckel garant des lois', './img_Cartes/Teckel_97.webp'),
(98, 'Teckel roi', 6, 'Teckel majestueux', './img_Cartes/Teckel_98.webp'),
(99, 'Teckel astronaute', 6, 'Teckel explorateur de l\'espace', './img_Cartes/Teckel_99.webp'),
(100, 'Teckel pilote de F1', 6, 'Teckel à toute vitesse', './img_Cartes/Teckel_100.webp');

-- --------------------------------------------------------

--
-- Structure de la table `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `carte_id` int(11) NOT NULL,
  `nb_exemplaires` int(11) DEFAULT 1,
  `nb_brillante` int(11) DEFAULT 0,
  `nb_alternative` int(11) DEFAULT 0,
  `nb_noir_blanc` int(11) DEFAULT 0,
  `nb_gold` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `collections`
--

INSERT INTO `collections` (`id`, `utilisateur_id`, `carte_id`, `nb_exemplaires`, `nb_brillante`, `nb_alternative`, `nb_noir_blanc`, `nb_gold`) VALUES
(1, 1, 1, 2, 0, 0, 0, 0),
(2, 1, 2, 1, 0, 0, 0, 0),
(3, 1, 3, 1, 0, 0, 0, 0),
(4, 1, 4, 1, 0, 0, 0, 0),
(7, 6, 17, 20, 0, 0, 0, 0),
(8, 6, 88, 16, 0, 0, 0, 0),
(9, 6, 75, 16, 0, 0, 0, 0),
(10, 6, 38, 13, 0, 0, 0, 0),
(11, 6, 89, 12, 0, 0, 0, 0),
(12, 6, 64, 14, 0, 0, 0, 0),
(14, 6, 37, 15, 0, 0, 0, 0),
(15, 6, 46, 21, 0, 0, 0, 0),
(16, 6, 53, 17, 0, 0, 0, 0),
(17, 6, 50, 14, 0, 0, 0, 0),
(18, 6, 99, 9, 1, 0, 0, 0),
(19, 6, 16, 14, 0, 0, 0, 0),
(21, 6, 41, 7, 2, 0, 0, 0),
(22, 6, 14, 15, 0, 0, 0, 0),
(23, 6, 42, 21, 0, 0, 0, 0),
(24, 6, 97, 11, 0, 0, 0, 0),
(26, 6, 18, 2, 2, 0, 0, 0),
(28, 6, 66, 17, 0, 0, 0, 0),
(29, 6, 19, 13, 0, 0, 0, 0),
(30, 6, 34, 14, 0, 0, 0, 0),
(31, 6, 78, 18, 0, 0, 0, 0),
(32, 6, 27, 17, 0, 0, 0, 0),
(33, 6, 86, 16, 0, 0, 0, 0),
(34, 6, 45, 12, 0, 0, 0, 0),
(35, 6, 51, 19, 0, 0, 0, 0),
(36, 6, 96, 7, 1, 0, 0, 0),
(37, 6, 6, 10, 1, 0, 0, 0),
(38, 6, 13, 12, 0, 0, 0, 0),
(39, 6, 73, 14, 0, 0, 0, 0),
(40, 6, 32, 15, 0, 0, 0, 0),
(42, 6, 21, 19, 0, 0, 0, 0),
(43, 6, 15, 9, 1, 0, 0, 0),
(46, 6, 22, 16, 0, 0, 0, 0),
(51, 6, 71, 12, 0, 0, 0, 0),
(52, 6, 35, 15, 0, 0, 0, 0),
(53, 6, 33, 7, 0, 0, 0, 0),
(55, 6, 26, 21, 0, 0, 0, 0),
(58, 6, 59, 13, 0, 0, 0, 0),
(59, 6, 10, 15, 0, 0, 0, 0),
(60, 6, 29, 6, 1, 0, 0, 0),
(61, 6, 62, 24, 0, 0, 0, 0),
(62, 6, 91, 15, 0, 0, 0, 0),
(63, 6, 9, 14, 0, 0, 0, 0),
(66, 6, 87, 10, 0, 0, 0, 0),
(69, 6, 24, 17, 0, 0, 0, 0),
(70, 6, 52, 13, 1, 0, 0, 0),
(71, 6, 1, 74, 21, 0, 0, 0),
(73, 6, 92, 13, 0, 0, 0, 0),
(74, 6, 79, 11, 0, 0, 0, 0),
(76, 6, 8, 9, 0, 0, 0, 0),
(77, 6, 98, 5, 0, 0, 0, 0),
(78, 6, 47, 10, 0, 0, 0, 0),
(81, 6, 4, 4, 1, 0, 0, 0),
(82, 6, 84, 15, 0, 0, 0, 0),
(85, 6, 3, 1, 1, 0, 0, 0),
(86, 6, 7, 10, 0, 0, 0, 0),
(90, 6, 77, 19, 0, 0, 0, 0),
(92, 6, 72, 17, 0, 0, 0, 0),
(95, 6, 57, 18, 0, 0, 0, 0),
(97, 6, 70, 17, 0, 0, 0, 0),
(98, 6, 5, 4, 2, 0, 0, 0),
(99, 6, 49, 17, 0, 0, 0, 0),
(102, 6, 31, 13, 0, 0, 0, 0),
(103, 6, 58, 5, 2, 0, 0, 0),
(105, 6, 30, 12, 0, 0, 0, 0),
(108, 6, 40, 11, 2, 0, 0, 0),
(110, 6, 61, 22, 0, 0, 0, 0),
(111, 6, 54, 14, 0, 0, 0, 0),
(112, 6, 69, 11, 0, 0, 0, 0),
(113, 6, 23, 13, 0, 0, 0, 0),
(115, 6, 20, 10, 0, 0, 0, 0),
(117, 6, 68, 12, 0, 0, 0, 0),
(122, 6, 11, 14, 0, 0, 0, 0),
(123, 6, 55, 14, 0, 0, 0, 0),
(126, 6, 48, 16, 0, 0, 0, 0),
(131, 6, 80, 15, 0, 0, 0, 0),
(134, 6, 44, 16, 0, 0, 0, 0),
(135, 6, 76, 12, 0, 0, 0, 0),
(144, 6, 82, 15, 0, 0, 0, 0),
(150, 6, 63, 11, 0, 0, 0, 0),
(153, 6, 56, 15, 0, 0, 0, 0),
(155, 6, 100, 3, 4, 0, 0, 0),
(168, 6, 28, 17, 0, 0, 0, 0),
(187, 6, 95, 14, 0, 0, 0, 0),
(202, 6, 94, 13, 0, 0, 0, 0),
(214, 6, 85, 18, 0, 0, 0, 0),
(215, 6, 39, 12, 0, 0, 0, 0),
(224, 6, 93, 11, 0, 0, 0, 0),
(225, 6, 25, 15, 0, 0, 0, 0),
(226, 6, 12, 14, 0, 0, 0, 0),
(245, 6, 36, 12, 0, 0, 0, 0),
(246, 6, 43, 15, 0, 0, 0, 0),
(261, 6, 67, 15, 0, 0, 0, 0),
(269, 6, 90, 11, 0, 0, 0, 0),
(309, 6, 81, 16, 0, 0, 0, 0),
(356, 6, 65, 10, 0, 0, 0, 0),
(520, 6, 83, 7, 0, 0, 0, 0),
(535, 6, 60, 16, 0, 0, 0, 0),
(738, 7, 64, 1, 0, 0, 0, 0),
(739, 7, 62, 2, 0, 0, 0, 0),
(740, 7, 91, 1, 0, 0, 0, 0),
(741, 7, 74, 1, 0, 0, 0, 0),
(742, 7, 46, 2, 0, 0, 0, 0),
(743, 7, 50, 3, 0, 0, 0, 0),
(744, 7, 6, 2, 0, 0, 0, 0),
(745, 7, 84, 2, 0, 0, 0, 0),
(746, 7, 93, 1, 0, 0, 0, 0),
(747, 7, 75, 3, 0, 0, 0, 0),
(748, 7, 83, 1, 0, 0, 0, 0),
(749, 7, 66, 3, 0, 0, 0, 0),
(750, 7, 35, 2, 0, 0, 0, 0),
(751, 7, 81, 1, 0, 0, 0, 0),
(752, 7, 43, 1, 0, 0, 0, 0),
(754, 7, 85, 1, 0, 0, 0, 0),
(755, 7, 61, 1, 0, 0, 0, 0),
(756, 7, 31, 1, 0, 0, 0, 0),
(757, 7, 23, 1, 0, 0, 0, 0),
(758, 7, 80, 4, 0, 0, 0, 0),
(759, 7, 78, 2, 0, 0, 0, 0),
(761, 7, 79, 1, 0, 0, 0, 0),
(762, 7, 34, 2, 0, 0, 0, 0),
(763, 7, 99, 1, 0, 0, 0, 0),
(764, 7, 87, 2, 0, 0, 0, 0),
(765, 7, 38, 1, 0, 0, 0, 0),
(766, 7, 57, 1, 0, 0, 0, 0),
(768, 7, 4, 1, 0, 0, 0, 0),
(769, 7, 63, 2, 0, 0, 0, 0),
(770, 7, 29, 1, 0, 0, 0, 0),
(772, 7, 68, 1, 0, 0, 0, 0),
(773, 7, 33, 1, 0, 0, 0, 0),
(774, 7, 41, 2, 0, 0, 0, 0),
(775, 7, 94, 2, 0, 0, 0, 0),
(777, 7, 32, 2, 0, 0, 0, 0),
(780, 7, 72, 1, 0, 0, 0, 0),
(781, 7, 55, 1, 0, 0, 0, 0),
(782, 7, 53, 2, 0, 0, 0, 0),
(783, 7, 2, 1, 0, 0, 0, 0),
(786, 7, 48, 1, 0, 0, 0, 0),
(787, 7, 70, 1, 0, 0, 0, 0),
(790, 7, 90, 1, 0, 0, 0, 0),
(791, 7, 36, 1, 0, 0, 0, 0),
(792, 7, 1, 1, 0, 0, 0, 0),
(793, 7, 51, 1, 0, 0, 0, 0),
(794, 7, 54, 1, 0, 0, 0, 0),
(795, 7, 9, 1, 0, 0, 0, 0),
(797, 7, 56, 1, 0, 0, 0, 0),
(798, 7, 3, 1, 0, 0, 0, 0),
(799, 7, 5, 2, 0, 0, 0, 0),
(801, 7, 60, 2, 0, 0, 0, 0),
(804, 7, 67, 2, 0, 0, 0, 0),
(812, 8, 31, 1, 0, 0, 0, 0),
(813, 8, 26, 1, 0, 0, 0, 0),
(814, 8, 71, 2, 0, 0, 0, 0),
(815, 8, 21, 1, 0, 0, 0, 0),
(816, 8, 6, 2, 0, 0, 0, 0),
(817, 8, 44, 3, 0, 0, 0, 0),
(818, 8, 33, 1, 0, 0, 0, 0),
(819, 8, 81, 1, 0, 0, 0, 0),
(821, 8, 41, 1, 0, 0, 0, 0),
(822, 8, 20, 1, 0, 0, 0, 0),
(824, 8, 48, 1, 0, 0, 0, 0),
(825, 8, 84, 1, 0, 0, 0, 0),
(826, 8, 3, 1, 0, 0, 0, 0),
(828, 8, 52, 1, 0, 0, 0, 0),
(829, 8, 34, 1, 0, 0, 0, 0),
(830, 8, 51, 1, 0, 0, 0, 0),
(831, 8, 15, 1, 0, 0, 0, 0),
(832, 8, 95, 1, 0, 0, 0, 0),
(833, 8, 13, 1, 0, 0, 0, 0),
(834, 8, 86, 1, 0, 0, 0, 0),
(836, 8, 5, 1, 0, 0, 0, 0),
(837, 8, 24, 1, 0, 0, 0, 0),
(838, 8, 12, 1, 0, 0, 0, 0),
(839, 8, 37, 1, 0, 0, 0, 0),
(840, 8, 11, 1, 0, 0, 0, 0),
(1243, 7, 92, 1, 0, 0, 0, 0),
(1244, 7, 47, 2, 0, 0, 0, 0),
(1245, 7, 16, 3, 0, 0, 0, 0),
(1246, 7, 20, 1, 0, 0, 0, 0),
(1247, 7, 18, 1, 0, 0, 0, 0),
(1248, 7, 28, 1, 0, 0, 0, 0),
(1252, 7, 73, 3, 0, 0, 0, 0),
(1253, 7, 65, 1, 0, 0, 0, 0),
(1256, 7, 30, 1, 0, 0, 0, 0),
(1257, 7, 69, 3, 0, 0, 0, 0),
(1261, 7, 19, 2, 0, 0, 0, 0),
(1265, 7, 82, 1, 0, 0, 0, 0),
(1267, 7, 25, 1, 0, 0, 0, 0),
(1269, 7, 17, 1, 0, 0, 0, 0),
(1349, 9, 44, 2, 0, 0, 0, 0),
(1350, 9, 34, 1, 0, 0, 0, 0),
(1351, 9, 62, 1, 0, 0, 0, 0),
(1352, 9, 56, 1, 0, 0, 0, 0),
(1353, 9, 35, 1, 0, 0, 0, 0),
(1354, 9, 39, 1, 0, 0, 0, 0),
(1355, 9, 80, 1, 0, 0, 0, 0),
(1356, 9, 64, 1, 0, 0, 0, 0),
(1357, 9, 26, 2, 0, 0, 0, 0),
(1358, 9, 54, 1, 0, 0, 0, 0),
(1359, 9, 70, 1, 0, 0, 0, 0),
(1360, 9, 92, 1, 0, 0, 0, 0),
(1361, 9, 25, 2, 0, 0, 0, 0),
(1362, 9, 84, 1, 0, 0, 0, 0),
(1363, 9, 94, 1, 0, 0, 0, 0),
(1364, 9, 17, 1, 0, 0, 0, 0),
(1365, 9, 36, 1, 0, 0, 0, 0),
(1366, 9, 95, 1, 0, 0, 0, 0),
(1367, 9, 4, 1, 0, 0, 0, 0),
(1368, 9, 79, 1, 0, 0, 0, 0),
(1369, 9, 91, 2, 0, 0, 0, 0),
(1371, 9, 76, 1, 0, 0, 0, 0),
(1372, 9, 10, 1, 0, 0, 0, 0),
(1373, 9, 86, 1, 0, 0, 0, 0),
(1374, 9, 66, 1, 0, 0, 0, 0),
(1375, 9, 65, 1, 0, 0, 0, 0),
(1377, 9, 40, 1, 0, 0, 0, 0),
(1379, 9, 61, 1, 0, 0, 0, 0),
(1380, 9, 87, 1, 0, 0, 0, 0),
(1381, 9, 100, 1, 0, 0, 0, 0),
(1382, 9, 82, 1, 0, 0, 0, 0),
(1383, 9, 19, 1, 0, 0, 0, 0),
(1536, 6, 2, 1, 0, 0, 0, 0),
(1603, 6, 74, 1, 0, 0, 0, 0),
(1625, 11, 6, 1, 0, 0, 0, 0),
(1626, 11, 9, 1, 0, 0, 0, 0),
(1627, 11, 65, 1, 0, 0, 0, 0),
(1628, 11, 31, 1, 0, 0, 0, 0),
(1629, 11, 11, 1, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `pseudo` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `jetons` int(11) NOT NULL DEFAULT 10,
  `dernier_gain` datetime DEFAULT NULL,
  `tentatives` int(11) DEFAULT 0,
  `verrouillage` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `pseudo`, `email`, `mot_de_passe`, `jetons`, `dernier_gain`, `tentatives`, `verrouillage`) VALUES
(1, 'admin', 'admin@gmail.com', '$2y$10$hs4fGMT3xUgpWRXo74fiIOXFlz4t3BGKIsvz3CwcZACLbfhzZ2sdy', 1000, NULL, 0, NULL),
(6, 'kylia', 'kylianlegeay35@icloud.com', '$2y$10$/wosuFnwZOLyKS5CVV7gxO6jrY0BlNqyzOwDPr60f7oS//k7v/cV.', 10493, '2025-04-26 15:08:01', 0, NULL),
(7, 'caca', 'ydrt@gmail.com', '$2y$10$TNhCsNgQKxbjx6RxuvrEKOQTglrSfMgs/WO1Qm.QLDYECEM5yHPfu', 13, '2025-03-10 11:17:34', 0, NULL),
(8, 'testbooster', 'testbooster@gmail.com', '$2y$10$ev3ct26t7ghtiSW/Vs0nAu21bkLs2Af1tJ55pOYQubt2Nc4mxkFRK', 1, '2024-12-27 12:28:50', 0, NULL),
(9, 'pipi', 'pipi@gmail.com', '$2y$10$cGPWXssu/yd3ETrhh3tEOuOwM2c8rySfjFXAXaPALfgut8Rl9XJVi', 0, '2025-03-11 19:33:22', 0, NULL),
(10, 'test1', 'test1@gmail.com', '$2y$10$HrAVD5qEGRluS8E9VgwfT.QK/crOgURcYFYclPOEqmfceOlpDE162', 10, NULL, 0, NULL),
(11, 'lekyks', 'kylianlegeay.pro@gmail.com', '$2y$10$wjXrY/EhSoU/uCRhQpOpweeIYjpT/gBxcSyOUQMmxFM965m58ryry', 6, '2025-03-23 17:46:58', 0, NULL),
(14, 'gerard', 'gerard@gmail.com', '$2b$10$h3XRVGBRQG/5IBgNUunwf.auurK62SY/Jovxpb.z0qwkiAHGc8ioi', 10, NULL, 0, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cartes`
--
ALTER TABLE `cartes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `utilisateur_id` (`utilisateur_id`,`carte_id`),
  ADD KEY `carte_id` (`carte_id`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pseudo` (`pseudo`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cartes`
--
ALTER TABLE `cartes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT pour la table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1672;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `collections`
--
ALTER TABLE `collections`
  ADD CONSTRAINT `collections_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `collections_ibfk_2` FOREIGN KEY (`carte_id`) REFERENCES `cartes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
