# Cable Sizer

*[English version](README.md)*

**App en ligne : https://conducteur-section.vercel.app/** · **Manuel complet : [docs/MANUEL.fr.md](docs/MANUEL.fr.md)**

Application web d'une seule page qui calcule la section d'un conducteur électrique selon plusieurs critères et retient
la plus petite section normalisée (IEC 60228) qui les respecte tous. HTML/CSS/JavaScript simple : aucune dépendance,
aucun build, fonctionne hors ligne en double-cliquant sur `index.html`, et peut être hébergée telle quelle sur
n'importe quel hébergeur statique.

> [!WARNING]
> ## ⚠️ Avertissement — aucune garantie
> Les valeurs et résultats fournis par Cable Sizer sont **uniquement indicatifs et NE SONT PAS garantis**. Ils
> peuvent contenir des erreurs (transcription des données, modèles simplifiés, hypothèses) et ne remplacent ni les
> normes applicables (RGIE, NF C 15-100, IEC 60364) ni l'étude d'un professionnel qualifié.
>
> **Vous devez vérifier chaque résultat. Vous restez seul et entièrement responsable de l'utilisation de cet outil
> et de toute installation réalisée avec lui.** L'auteur décline toute responsabilité pour tout dommage résultant
> de son utilisation.

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
| `docs/MANUAL.en.md`, `docs/MANUEL.fr.md` | Manuel utilisateur et technique (anglais, français) |
| `FSD.md`, `JOURNAL.md` | Spécification fonctionnelle et journal des modifications (internes) |

Les trois fichiers de l'app (`index.html`, `i18n.js`, `iz-data.js`) doivent rester dans le même dossier.

## Paramètres

Chaque paramètre marqué **ⓘ** dans l'app affiche une explication au survol (en le touchant sur téléphone). Résumé
ci-dessous ; le [manuel](docs/MANUEL.fr.md) donne tout le détail technique, des exemples chiffrés et la signification
de chaque avertissement.

### Système et charge
| Paramètre | Explication |
|---|---|
| Système | Continu (2 conducteurs, b = 2), AC monophasé (phase + neutre, b = 2), AC triphasé équilibré (b = √3, pas de courant dans le neutre, saisir la tension entre phases). |
| Tension U | Tension continue, 230 V phase-neutre en monophasé, 400 V entre phases en triphasé. Référence de la chute de tension en %. |
| Courant / Puissance | Courant d'emploi Ib, ou puissance active P convertie en courant : I = P/U (continu), P/(U·cos φ) (1~), P/(√3·U·cos φ) (3~). |
| cos φ | Puissance active / apparente : 1 pour le chauffage, 0,8 à 0,9 pour les moteurs. Convertit P en I et pondère résistance (cos φ) et réactance (sin φ) dans la chute de tension. |

### Ligne
| Paramètre | Explication |
|---|---|
| Longueur du câble (aller simple) | Longueur du câble, sans la doubler : le conducteur de retour est inclus par les formules (×2 ou ×√3). |
| Réactance x | Environ 0,08 mΩ/m pour un câble. Indépendante de la section : sur une ligne alternative longue et très chargée, la chute réactive b·L·I·x·sin φ peut à elle seule dépasser la limite, et alors aucune section ne convient. |
| Fréquence f | 50 Hz. Épaisseur de peau δ = √(ρ/(π·f·μ0)) ≈ 9,3 mm pour le cuivre à 20 °C ; un avertissement apparaît si le rayon du conducteur dépasse δ. |

### Pose
| Paramètre | Explication |
|---|---|
| Type de pose | Associé à la méthode de référence IEC 60364-5-52 : A (paroi isolée, moulure ou meuble en bois), B (conduit, goulotte, cloison creuse, chape), C (fixé apparent, noyé dans la maçonnerie), D1/D2 (enterré sous fourreau / direct), E/F (air libre sur chemin perforé). Plus la chaleur s'évacue mal, plus Iz est faible (environ ×1,5 entre A et E). |
| Type de câble | Multiconducteur (gaine commune, ex. 3G2,5) ou unipolaire (conducteurs séparés sous conduit, câbles unipolaires) : A1/A2, B1/B2, F/E. Les conducteurs sans gaine doivent passer sous conduit ou goulotte. |
| Ambiante max | Température de l'air la plus élevée en service (température du sol pour D1/D2), pas pendant la pose. Les tables sont données pour 30 °C à l'air / 20 °C dans le sol. |
| Marge de sécurité (K) | Ajoutée à l'ambiante pour tous les calculs thermiques : θcalc = θamb,max + marge (5 à 10 K est courant). |
| Facteur de groupement | Déclassement quand plusieurs circuits chargés sont posés ensemble. En faisceau (IEC B.52.17) : 2 → 0,80, 3 → 0,70, 4 → 0,65, 6 → 0,57, 9 → 0,50, 20 → 0,38. On compte les circuits, pas les conducteurs. Saisi à la main. |
| kθ | Correction d'ambiante √((θmax − θcalc)/(θmax − θréf)), θréf = 30 °C (air) ou 20 °C (sol) ; vide = automatique, ou imposer une valeur des tableaux. |

### Conducteur
| Paramètre | Explication |
|---|---|
| Matériau | Cuivre ρ20 = 0,017241 Ω·mm²/m, α = 0,00393 /K ; aluminium 0,028264, 0,00403 (≈ 1,64 fois plus résistif). |
| Isolant / θmax | PVC 70 °C (160 °C en court-circuit), PR/EPR 90 °C (250 °C) ; le PR admet environ 20 à 30 % de courant en plus. |
| Mode de résistivité | À θmax (par défaut, cas le plus défavorable pour dimensionner), à une température manuelle, ou convention IEC 1,25 × ρ20. ρ(T) = ρ20·(1 + α·(T − 20)) : cuivre +19,7 % à 70 °C. |

### Critères
| Critère | Explication |
|---|---|
| Chute de tension | S = b·ρ·L·I·cos φ / (ΔUmax − b·L·I·x·sin φ). Limites typiques (NF C 15-100) : 3 % éclairage, 5 % autres usages. |
| Pertes | S = n·ρ·L·I² / Pmax (n = 2 ou 3 conducteurs chargés) ; limite en W ou en % de la puissance transportée. |
| Courant admissible | Normatif : plus petite section telle que Iz × kθ × groupement ≥ I, d'après la table IEC de la méthode de référence. |
| Échauffement (modèle) | Bilan thermique d'un conducteur nu à l'air libre, h ≈ 10 W/m²·K ; estimation, optimiste hors air libre (désactivé par défaut). |
| Court-circuit | Adiabatique : S ≥ Icc·√t / k, t ≤ 5 s ; k = 115 / 143 / 76 / 94 (Cu-PVC / Cu-PR / Al-PVC / Al-PR). |
| Protection | Coordination I ≤ In ≤ Iz × kθ × groupement. |

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

---

> [!WARNING]
> ## ⚠️ Avertissement — aucune garantie
> Les valeurs et résultats fournis par Cable Sizer sont **uniquement indicatifs et NE SONT PAS garantis**. Ils
> peuvent contenir des erreurs (transcription des données, modèles simplifiés, hypothèses) et ne remplacent ni les
> normes applicables (RGIE, NF C 15-100, IEC 60364) ni l'étude d'un professionnel qualifié.
>
> **Vous devez vérifier chaque résultat. Vous restez seul et entièrement responsable de l'utilisation de cet outil
> et de toute installation réalisée avec lui.** L'auteur décline toute responsabilité pour tout dommage résultant
> de son utilisation.
