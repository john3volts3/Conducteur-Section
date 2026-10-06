# Cable Sizer

*[English version](README.md)*

Application web d'une seule page qui calcule la section d'un conducteur électrique selon plusieurs critères et retient
la plus petite section normalisée (IEC 60228) qui les respecte tous. HTML/CSS/JavaScript simple : aucune dépendance,
aucun build, fonctionne hors ligne en double-cliquant sur `index.html`, et peut être hébergée telle quelle sur
n'importe quel hébergeur statique.

> **Outil indicatif.** Les résultats doivent être vérifiés selon la norme applicable (RGIE, NF C 15-100, IEC 60364)
> par une personne qualifiée.

## Fonctionnalités

- **Systèmes** : continu, alternatif monophasé, alternatif triphasé. Charge exprimée en courant ou en puissance active (+ cos φ).
- **Critères** (chacun activable avec sa propre limite) :
  - chute de tension maximale (V ou %), réactance de ligne comprise en alternatif ;
  - pertes maximales (W ou % de la puissance transportée) ;
  - courant admissible Iz d'après les tables IEC 60364-5-52, corrigé pour la température et le groupement ;
  - échauffement, modèle physique de bilan thermique (estimation, à l'air libre) ;
  - tenue au court-circuit (Icc, temps de coupure, k automatique ou manuel) ;
  - calibre de protection In (vérifie I ≤ In ≤ Iz).
- **Types de pose** associés aux méthodes de référence IEC (A1 … F) : noyé dans la maçonnerie, sous conduit,
  goulotte, cloison creuse ou isolée, moulure ou meuble en bois, fixé apparent, chape, enterré, chemin de câbles,
  ou choix manuel.
- **Températures** : ambiante maximale + marge de sécurité (K) → ambiante de calcul utilisée pour tous les calculs
  thermiques ; résistivité à la température maximale de l'isolant (ou à une température choisie, ou convention IEC 1,25 × ρ20).
- **Résultats** : tableau des sections requises et normalisées par critère, critère dimensionnant mis en évidence,
  chute de tension et pertes réelles, température estimée du conducteur, longueur maximale, contrôle de l'effet de peau,
  avertissements.
- **Tables de courant admissible** : 72 tables (Cu/Al, PVC/PR, méthodes A1 à F, 2 ou 3 conducteurs chargés),
  modifiables table par table, retour aux valeurs normalisées, export/import JSON.
- Interface anglais / français, point ou virgule acceptés comme séparateur décimal, thème clair/sombre,
  « Copier les résultats » en texte, paramètres mémorisés dans le navigateur.

## Démarrage rapide

1. Téléchargez ou clonez le dépôt.
2. Ouvrez `index.html` dans un navigateur (double-clic). Rien à installer.
3. Facultatif : ouvrez `index.html?test` pour lancer les auto-tests (résultats dans la console du navigateur et dans un bandeau).

**Longueur du câble** : saisissez la longueur du câble (aller simple). Le conducteur de retour est pris en compte par
les formules (×2 en continu et en monophasé, ×√3 en triphasé équilibré).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page, styles et logique |
| `i18n.js` | Tous les textes affichés (anglais, français) |
| `iz-data.js` | Courants admissibles normalisés (facultatif : sans lui, les tables Iz sont vides) |
| `grouping-data.js` | Facteurs de groupement IEC conservés pour une version future (pas encore utilisés) |
| `FSD.md`, `JOURNAL.md` | Spécification fonctionnelle et journal des modifications (internes) |

Les trois fichiers de l'app (`index.html`, `i18n.js`, `iz-data.js`) doivent rester dans le même dossier.

## Formules principales

Unités : mm², m, A, V, Ω·mm²/m. b = 2 (continu, monophasé) ou √3 (triphasé) ; n = 2 ou 3 conducteurs chargés.

| Critère | Section requise |
|---|---|
| Chute de tension | S = b·ρ·L·I·cos φ / (ΔUmax − b·L·I·x·sin φ) |
| Pertes | S = n·ρ·L·I² / Pmax |
| Court-circuit | S = Icc·√t / k |
| Échauffement (modèle) | S = (I²·ρ / (2·√π·h·ΔT·10⁻³))^(2/3) |
| Courant admissible | plus petite S telle que Iz × kθ × groupement ≥ I, kθ = √((θmax − θcalc)/(θmax − θréf)) |

La spécification détaillée se trouve dans [FSD.md](FSD.md).

## Sources des données

- Courant admissible : IEC 60364-5-52:2009 annexe B, tableaux B.52.2 à B.52.5 et B.52.10 à B.52.13 (référence 30 °C
  à l'air, 20 °C dans le sol). Valeurs transcrites de deux reproductions indépendantes de la norme et recoupées cellule
  par cellule (données du 2026-10-06). La version des données est affichée dans l'app et dans les résultats copiés.
- Facteurs k de court-circuit : 115 / 143 / 76 / 94 (Cu-PVC / Cu-PR / Al-PVC / Al-PR), 103 / 68 pour le PVC au-delà de 300 mm².

## Limites

- Le facteur de groupement est saisi à la main.
- Le déclassement supplémentaire des câbles en contact avec un isolant thermique (jusqu'à 0,5) est seulement signalé, pas appliqué.
- « Dans un meuble en bois » ne figure pas dans la norme : la méthode A1/A2 est une hypothèse prudente.
- La résistance en alternatif est prise égale à la résistance en continu (l'effet de peau est seulement signalé).
- Pas de vérification de la boucle de défaut (protection des personnes).

## Mise en ligne

L'app est statique : publiez `index.html`, `i18n.js` et `iz-data.js` sur n'importe quel hébergeur web.
Avec Vercel, importez le dépôt GitHub (Framework preset : *Other*, sans commande de build) ; chaque push redéploie.
Le fichier `.vercelignore` ne publie que les fichiers de l'app.
