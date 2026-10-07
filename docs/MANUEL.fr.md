# Cable Sizer — Manuel utilisateur et technique

*[English version](MANUAL.en.md) · [README](../README.fr.md)*

App en ligne : https://conducteur-section.vercel.app/

> [!WARNING]
> ## ⚠️ Avertissement — aucune garantie
> Les valeurs et résultats fournis par Cable Sizer sont **uniquement indicatifs et NE SONT PAS garantis**. Ils
> peuvent contenir des erreurs (transcription des données, modèles simplifiés, hypothèses) et ne remplacent ni les
> normes applicables (RGIE, NF C 15-100, IEC 60364) ni l'étude d'un professionnel qualifié.
>
> **Vous devez vérifier chaque résultat. Vous restez seul et entièrement responsable de l'utilisation de cet outil
> et de toute installation réalisée avec lui.** L'auteur décline toute responsabilité pour tout dommage résultant
> de son utilisation.

## Sommaire

1. [Principe](#1-principe)
2. [Démarrage rapide](#2-démarrage-rapide)
3. [Interface](#3-interface)
4. [Paramètres](#4-paramètres)
5. [Critères](#5-critères)
6. [Résultats](#6-résultats)
7. [Tables de courant admissible](#7-tables-de-courant-admissible)
8. [Avertissements](#8-avertissements)
9. [Exemples chiffrés](#9-exemples-chiffrés)
10. [Limites](#10-limites)
11. [Références et glossaire](#11-références-et-glossaire)

---

## 1. Principe

Un conducteur doit respecter en même temps plusieurs exigences indépendantes :

- transporter son courant **sans surchauffer** son isolant (courant admissible) ;
- fournir une **tension** acceptable à la charge (chute de tension) ;
- gaspiller une quantité d'**énergie** acceptable (pertes) ;
- **supporter un court-circuit** jusqu'au déclenchement de la protection ;
- être **protégé** par son disjoncteur ou son fusible (coordination I ≤ In ≤ Iz).

Pour chaque critère activé, Cable Sizer calcule la **section requise** (valeur exacte en mm²), l'arrondit à la
**section normalisée** IEC 60228 supérieure, puis retient la **plus grande** de ces sections normalisées. Le critère
qui donne cette section est le **critère dimensionnant**. Le résultat est recalculé à chaque frappe.

Sections normalisées (mm²) : 0,5 · 0,75 · 1 · 1,5 · 2,5 · 4 · 6 · 10 · 16 · 25 · 35 · 50 · 70 · 95 · 120 · 150 · 185 ·
240 · 300 · 400 · 500 · 630. Au-delà de 630 mm², il faut envisager des conducteurs en parallèle (non calculés par l'app).

## 2. Démarrage rapide

1. Choisissez le **système** (continu, monophasé, triphasé) et saisissez la **tension** et le **courant** (ou la puissance).
2. Saisissez la **longueur du câble** (aller simple).
3. Décrivez la **pose** : type de pose, type de câble, température ambiante maximale.
4. Choisissez le **conducteur** (cuivre / aluminium) et l'**isolant** (PVC / PR).
5. Activez les **critères** utiles et fixez leurs limites.
6. Lisez la section recommandée, le critère dimensionnant et les avertissements dans le panneau des résultats.

Chaque libellé marqué d'un **ⓘ** affiche une explication au survol de la souris (ou en le touchant sur téléphone).

## 3. Interface

| Élément | Rôle |
|---|---|
| Bouton de langue | Bascule anglais / français. Les nombres s'affichent avec le séparateur décimal de la langue. |
| Bouton de thème | Auto (suit le système), clair, sombre. |
| Copier les résultats | Copie un rapport texte complet (entrées, tableau des critères, résultat, synthèse, avertissements, version des données). |
| Réinitialiser | Rétablit les paramètres par défaut. Les tables de courant admissible personnalisées sont conservées. |
| Panneau des résultats | Section recommandée, tableau des critères, synthèse de la section retenue, avertissements. Sur téléphone, une barre en bas d'écran affiche la section et mène aux résultats. |

**Saisie des nombres** : le point et la virgule sont acceptés comme séparateur décimal, quelle que soit la langue
(`6.25` = `6,25`). Il n'y a pas de séparateur de milliers : `1,500` est lu 1,5. La notation scientifique est acceptée
(`1e-3`). Une valeur invalide est encadrée en rouge avec un message, et les résultats affichent « Saisies invalides ».

**Mémorisation** : tous les paramètres, la langue et le thème sont enregistrés dans le navigateur (localStorage). Ils ne
sont pas partagés entre navigateurs ou ordinateurs. En navigation privée, rien n'est conservé.

## 4. Paramètres

### 4.1 Système et charge

#### Système
- **Continu (DC)** : deux conducteurs (aller et retour). Facteur b = 2 pour la chute de tension, n = 2 conducteurs chargés.
- **AC monophasé** : phase + neutre, mêmes facteurs qu'en continu, plus le facteur de puissance et la réactance.
- **AC triphasé** : charge équilibrée, pas de courant dans le neutre. b = √3 (chute de tension entre phases), n = 3.
  La tension à saisir est la tension **entre phases** (ex. 400 V).

#### Tension U (V)
Tension nominale du circuit : tension continue, tension phase-neutre en monophasé (230 V), tension entre phases en
triphasé (400 V). Sert à convertir la puissance en courant et à exprimer la chute de tension en %.

#### Charge exprimée en — Courant I (A) / Puissance active P (W)
- **Courant** : courant d'emploi Ib du circuit (courant réellement absorbé par la charge).
- **Puissance** : puissance active en watts ; le courant est calculé :
  - continu : I = P / U
  - monophasé : I = P / (U · cos φ)
  - triphasé : I = P / (√3 · U · cos φ)

Le courant d'emploi et la puissance correspondante s'affichent sous la carte (« Courant d'emploi »). La puissance sert
aussi de référence pour les pertes en %.

#### Facteur de puissance cos φ (alternatif uniquement)
Rapport puissance active / puissance apparente, 0 < cos φ ≤ 1. Valeurs typiques : 1 pour le chauffage et l'éclairage à
incandescence, 0,95 à 1 pour les charges électroniques avec PFC, 0,8 à 0,9 pour les moteurs à pleine charge (moins en
charge partielle). Il intervient deux fois :
- dans la conversion P → I (un cos φ plus faible donne plus de courant pour la même puissance) ;
- dans la chute de tension, où il pondère la part résistive (cos φ) et la part réactive (sin φ).

### 4.2 Ligne

#### Longueur du câble, aller simple (m)
Longueur du **câble** entre l'origine et la charge. Ne la doublez **pas** : les formules incluent le conducteur de retour
(×2 en continu et en monophasé, ×√3 en triphasé). Exemple : un câble 2 conducteurs de 1 m → saisir 1 m.

#### Réactance x (mΩ/m, alternatif uniquement)
Réactance inductive par mètre de ligne, due au champ magnétique entre conducteurs. La valeur usuelle pour les câbles est
**0,08 mΩ/m** (convention IEC / RGIE / NF C 15-100) ; des câbles unipolaires espacés peuvent atteindre 0,1 à 0,15 mΩ/m.
Le terme réactif b·L·I·x·sin φ ne dépend pas de la section : pour les fortes sections et les grandes longueurs, il peut
dominer, et s'il dépasse à lui seul la chute de tension admise, **aucune section** ne peut respecter le critère (voir §5.1).

#### Fréquence f (Hz, alternatif uniquement)
Fréquence du réseau, 50 Hz en Europe. Sert uniquement au contrôle de l'**effet de peau** : l'épaisseur de peau
δ = √(ρ / (π · f · μ0)) (ρ en Ω·m) est comparée au rayon du conducteur r = √(S/π). À 50 Hz, δ ≈ 9,3 mm pour le cuivre à
20 °C, environ 10 mm à 70 °C : l'effet ne compte que pour de très fortes sections ou des fréquences élevées.

### 4.3 Pose

#### Type de pose
Décrit la manière dont le câble est posé. Chaque type correspond à une **méthode de référence IEC 60364-5-52**
(tableau B.52.3), qui détermine la table de courant admissible :

| Type de pose | Unipolaire | Multiconducteur | Remarques |
|---|---|---|---|
| Noyé directement dans la maçonnerie (sans conduit) | C | C | Câble avec gaine obligatoire |
| Sous conduit encastré dans la maçonnerie / le béton | B1 | B2 | |
| Goulotte en applique (ex. Legrand DLP) | B1 | B2 | |
| Cloison creuse non isolée (placo) | B1 | B2 | Choix prudent pour les petits vides |
| Paroi isolée thermiquement (placo + laine) | A1 | A2 | Déclassement supplémentaire possible (voir §8) |
| Moulure, plinthe ou enceinte en bois | A1 | A2 | |
| Dans un meuble en bois | A1 | A2 | Absent de la norme : hypothèse prudente |
| Fixé apparent sur mur ou plafond | C | C | Câble avec gaine obligatoire |
| Sous conduit noyé dans la chape | B1 | B2 | |
| Enterré sous fourreau | D1 | D1 | Référence 20 °C, sol 2,5 K·m/W |
| Enterré direct | D2 | D2 | Référence 20 °C, sol 2,5 K·m/W |
| Chemin de câbles perforé, à l'air libre | F | E | F = unipolaires jointifs |
| Autre — choisir la méthode de référence | manuel | manuel | |

Physiquement, la méthode traduit la facilité avec laquelle la chaleur produite dans le conducteur s'évacue : l'air libre
(E, F) est le plus favorable, un câble sur paroi (C) est bon, un conduit ou une goulotte (B) emprisonne l'air, une paroi
isolée thermiquement (A) est la plus défavorable. Pour une même section, Iz peut varier d'un facteur 1,5 environ entre A et E.

#### Type de câble
- **Câble multiconducteur** : plusieurs conducteurs isolés sous une gaine commune (ex. XVB, VVB, 3G2,5, 5G6).
- **Unipolaire** : conducteurs isolés séparés (ex. fils H07V-U/R sous conduit) ou câbles unipolaires.

Il fait basculer entre les méthodes « 1 » et « 2 » (A1/A2, B1/B2) et entre F et E. Les conducteurs isolés **sans gaine**
doivent toujours passer sous conduit ou goulotte : un avertissement s'affiche pour les poses qui exigent un câble gainé.

#### Méthode de référence (si le type de pose est « Autre »)
- **A1** : conducteurs isolés sous conduit dans une paroi isolée thermiquement.
- **A2** : câble multiconducteur sous conduit dans une paroi isolée thermiquement.
- **B1** : conducteurs isolés sous conduit ou goulotte sur paroi.
- **B2** : câble multiconducteur sous conduit ou goulotte sur paroi.
- **C** : câble fixé directement sur paroi (ou noyé directement dans la maçonnerie).
- **D1** : câble sous fourreau enterré. **D2** : câble enterré direct.
- **E** : câble multiconducteur à l'air libre (chemin perforé, à au moins 0,3 × diamètre de la paroi).
- **F** : câbles unipolaires jointifs à l'air libre (F avec 2 conducteurs chargés = jointifs à plat, 3 = en trèfle).

Le panneau affiche la méthode utilisée, le nombre de conducteurs chargés (2 en continu et monophasé, 3 en triphasé) et
la température de référence.

#### Température ambiante max θamb,max (°C)
Température la plus élevée du milieu entourant le câble **en fonctionnement** : l'air pour les méthodes A à F, le
**sol** pour D1 et D2. Ce n'est pas la température au moment de la pose. Pensez aux combles, chaufferies, façades
ensoleillées, cheminements près de tuyaux de chauffage. Les tables Iz sont données pour 30 °C à l'air et 20 °C dans le sol.

#### Marge de sécurité (K)
Valeur ajoutée à l'ambiante max pour **tous les calculs thermiques** : θcalc = θamb,max + marge. Elle couvre les points
chauds, les conditions incertaines ou le vieillissement. 0 K = pas de marge ; 5 à 10 K est courant. θcalc doit rester
inférieure à θmax, sinon une erreur s'affiche.

#### Facteur de groupement
Coefficient de réduction appliqué à Iz quand plusieurs **circuits chargés** sont posés ensemble (même goulotte, conduit,
chemin de câbles, faisceau) : chaque câble chauffe ses voisins, chacun doit donc transporter moins de courant.
1 = circuit seul.

IEC 60364-5-52 tableau B.52.17, en faisceau à l'air, sur une surface, encastrés ou enfermés (méthodes A à F) :

| Circuits | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12 | 16 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Facteur | 1,00 | 0,80 | 0,70 | 0,65 | 0,60 | 0,57 | 0,54 | 0,52 | 0,50 | 0,45 | 0,41 | 0,38 |

Couche simple sur paroi ou chemin non perforé (C) : 1,00, 0,85, 0,79, 0,75, 0,73, 0,72, 0,72, 0,71, 0,70 (1 à 9
circuits, pas de réduction supplémentaire au-delà de 9). Chemin de câbles perforé (E, F) : 1,00, 0,88, 0,82, 0,77, 0,75,
0,73, 0,73, 0,72, 0,72. Les câbles enterrés utilisent d'autres tableaux (B.52.18, B.52.19) selon l'espacement.

Règles : on compte les **circuits**, pas les conducteurs (un câble 3G2,5 = 1 circuit) ; un circuit chargé à moins de
30 % de son Iz groupé peut être ignoré. Le champ se saisit à la main ; les tableaux complets sont disponibles dans
`grouping-data.js`.

#### Facteur de température kθ (vide = auto)
Correction de Iz pour une ambiante différente de la référence :

kθ = √((θmax − θcalc) / (θmax − θréf)), avec θréf = 30 °C (air) ou 20 °C (sol).

Exemple : PVC (θmax 70 °C), θcalc = 40 °C → kθ = √(30/40) = 0,866. La formule reproduit les tableaux de correction IEC
(B.52.14 / B.52.15) à environ 1 % près. Saisissez une valeur pour imposer plutôt un facteur lu dans les tableaux.

Le **facteur total** kθ × groupement s'affiche sous la carte et s'applique à tous les Iz.

### 4.4 Conducteur

#### Matériau
- **Cuivre** : ρ20 = 0,017241 Ω·mm²/m, α = 0,00393 /K.
- **Aluminium** : ρ20 = 0,028264 Ω·mm²/m, α = 0,00403 /K. Environ 1,64 fois plus résistif : pour un même courant, en
  gros une section normalisée de plus. Les tables d'aluminium commencent à 2,5 ou 16 mm².

Changer de matériau remet ρ20 et α aux valeurs ci-dessus.

#### Isolant
- **PVC** : θmax = 70 °C en service permanent, 160 °C en fin de court-circuit (140 °C au-delà de 300 mm²).
- **PR / EPR** (polyéthylène réticulé, caoutchouc éthylène-propylène ; « XLPE » en anglais) : θmax = 90 °C, 250 °C en
  court-circuit. Courant admissible plus élevé (environ +20 à +30 %).

#### Température max du conducteur θmax (°C)
Température permanente maximale admise par l'isolant, fixée automatiquement (70 / 90 °C). Elle sert pour kθ, le modèle
thermique, les contrôles de température et, par défaut, la résistivité.

#### Mode de résistivité
- **À θmax de l'isolant (auto)** — par défaut : ρ = ρ(θmax). Cas le plus défavorable, le conducteur est supposé à sa
  température maximale : donne la plus forte chute de tension et les plus fortes pertes, ce qui est la bonne hypothèse
  pour dimensionner.
- **À la température du conducteur (manuel)** : ρ = ρ(T) avec votre température (ex. pour évaluer les pertes en charge partielle).
- **Convention IEC (1,25 × ρ20)** : valeur conventionnelle utilisée par certaines normes pour la chute de tension
  (ex. 1,25 × 0,018 = 0,0225 pour le cuivre avec ρ20 = 0,018).

Loi de température : ρ(T) = ρ20 · (1 + α · (T − 20)). Cuivre à 70 °C : 0,017241 × 1,1965 = 0,02063 Ω·mm²/m (+19,7 %).

#### ρ20 (Ω·mm²/m) et α (1/K)
Résistivité à 20 °C et son coefficient de température (valeurs IEC 60228 par défaut). Modifiables pour utiliser les
valeurs conventionnelles d'une norme nationale ou d'un fabricant.

### 4.5 Limites des critères

| Paramètre | Signification |
|---|---|
| Limite de chute de tension (V ou %) | Chute de tension maximale entre l'origine et la charge. En %, rapportée à U. Limites typiques (NF C 15-100, alimentation par le réseau public) : 3 % éclairage, 5 % autres usages ; poste de livraison privé : 6 % / 8 %. Réseaux continus 12/24 V : souvent 2 à 3 %. |
| Limite de pertes (W ou %) | Pertes Joule maximales dans le câble. En %, rapportées à la puissance active transportée P. |
| Coefficient d'échange h (W/m²·K) | Modèle thermique uniquement. Environ 10 W/m²·K en air calme (convection naturelle + rayonnement), 15 à 25 avec ventilation. |
| Icc (A) | Courant de court-circuit présumé au point considéré (fourni par le gestionnaire de réseau ou calculé depuis l'impédance de la source). |
| Temps de coupure t (s) | Temps mis par la protection pour interrompre le court-circuit. La formule adiabatique est valable jusqu'à 5 s. |
| k (A·√s/mm²) | Facteur matériau/isolant : 115 Cu-PVC, 143 Cu-PR, 76 Al-PVC, 94 Al-PR ; 103 / 68 pour le PVC au-delà de 300 mm². « k auto » le choisit automatiquement. |
| In (A) | Calibre du disjoncteur ou du fusible. |

## 5. Critères

Notations : S section (mm²), L longueur du câble (m), I courant d'emploi (A), U tension (V), ρ résistivité (Ω·mm²/m),
x réactance (Ω/m), b = 2 (continu, 1~) ou √3 (3~), n = 2 (continu, 1~) ou 3 (3~).

### 5.1 Chute de tension maximale
Chute de tension d'une ligne : ΔU = b · L · I · (ρ · cos φ / S + x · sin φ). En isolant S :

S = b · ρ · L · I · cos φ / (ΔUmax − b · L · I · x · sin φ)

En continu, cos φ = 1 et sin φ = 0. Si le dénominateur est ≤ 0, la chute réactive dépasse à elle seule la limite : le
critère est impossible quelle que soit la section (raccourcir la ligne, augmenter la tension, répartir sur plusieurs circuits).

### 5.2 Pertes maximales
Pertes Joule : P = n · ρ · L · I² / S → S = n · ρ · L · I² / Pmax. Utile pour le rendement (photovoltaïque, grandes
longueurs, lignes chargées en permanence).

### 5.3 Courant admissible (normatif)
Capacité corrigée : Iz' = Iz × kθ × groupement. L'app retient la plus petite section normalisée de la table telle que
Iz' ≥ I. Iz provient de la table IEC 60364-5-52 du matériau, de l'isolant, de la méthode de référence et du nombre de
conducteurs chargés (voir §7). C'est le critère de référence du dimensionnement thermique.

### 5.4 Échauffement (modèle thermique, estimation)
Bilan thermique en régime permanent d'un **conducteur nu seul à l'air libre** : la chaleur produite I²ρ/S égale la
chaleur échangée avec l'air h · π · D · ΔT, avec D = 2√(S/π) (mm → ×10⁻³ m) et ΔT = θmax − θcalc :

S = (I² · ρ(θmax) / (2 · √π · h · ΔT · 10⁻³))^(2/3)

Il ignore la résistance thermique de l'isolant, le mode de pose et les câbles voisins : il est optimiste hors air libre.
Il est désactivé par défaut ; à utiliser pour des barres nues ou comme contrôle croisé.

### 5.5 Tenue au court-circuit
Échauffement adiabatique pendant le défaut (IEC 60364-4-43, 434.5.2) : S ≥ Icc · √t / k.

k = K · √ln((β + θf) / (β + θi)) (IEC 60949), avec K = 226 et β = 234,5 pour le cuivre, K = 148 et β = 228 pour
l'aluminium, θi = θmax, θf = température finale de court-circuit. Cuivre/PVC 70 → 160 °C donne k = 115,0. La valeur de
la formule s'affiche sous le critère. Si la section retenue dépasse 300 mm² en PVC, k est abaissé à 103 / 68.

### 5.6 Calibre de protection
Coordination du câble et de sa protection : **I ≤ In ≤ Iz'**. L'app retient la plus petite section telle que Iz' ≥ In
et signale I > In. (La condition complémentaire I2 ≤ 1,45 Iz de l'IEC 60364-4-43 est respectée par les disjoncteurs normalisés.)

## 6. Résultats

### Tableau des critères
| Colonne | Signification |
|---|---|
| Critère | Nom du critère, avec une note (limite utilisée, Iz corrigé, k…). |
| Requise | Section exacte calculée par la formule, avant arrondi (« table » pour le courant admissible et la protection, qui lisent directement la table). |
| Normalisée | Section requise arrondie à la section normalisée IEC 60228 supérieure. Chaque section est suivie de son équivalent AWG. |
| État | OK, Erreur (impossible ou au-delà de 630 mm²), Pas de données (table vide), Échec (I > In), Dimensionnant (fixe le résultat). |

### Section retenue (synthèse)
| Ligne | Calcul |
|---|---|
| Chute de tension | ΔU = b · L · I · (ρ · cos φ / S + x · sin φ), en V et en % de U. |
| Pertes | P = n · ρ · L · I² / S, en W et en % de la puissance transportée. |
| Temp. estimée du conducteur | D'après la table : θ = θcalc + (θmax − θcalc) · (I / Iz')². Sans table : modèle de bilan thermique résolu avec ρ(θ). |
| Longueur max | Plus grande longueur respectant les limites de chute de tension et/ou de pertes avec la section retenue : L = ΔUmax / (b · I · (ρ cos φ / S + x sin φ)) et L = Pmax · S / (n · ρ · I²). La plus petite est affichée. |
| Iz' de la section retenue | Quand le critère de protection est activé. |
| Épaisseur de peau δ / rayon | Alternatif uniquement ; un avertissement apparaît si le rayon dépasse δ. |
| Courant d'emploi, résistivité ρ | Valeurs réellement utilisées. |

### Équivalent AWG
Chaque section affichée par l'application (carte de résultat, colonnes Requise et Normalisée, éditeur de courant
admissible, barre du téléphone, avertissements, rapport copié) est suivie de son **équivalent AWG** : la plus petite
taille American Wire Gauge dont la section est **au moins égale** à la section métrique. Les deux séries ne coïncident
jamais exactement : la taille supérieure est retenue (prudent). La carte de résultat est partagée en deux moitiés
égales : section métrique | équivalent AWG.

- Tailles listées : AWG 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1, 1/0, 2/0, 3/0, 4/0, puis 250 à 2000 kcmil.
- Section AWG : d = 0,127 · 92^((36 − n) / 39) mm, S = π · d² / 4 (1/0 → n = 0 … 4/0 → n = −3). 1 kcmil = 0,5067 mm².
- Exemples : 1,5 mm² → AWG 14 ; 2,5 mm² → AWG 12 ; 35 mm² → AWG 1 ; 120 mm² → 250 kcmil ; 630 mm² → 1250 kcmil.

### Convertisseur de section mm² ⇄ AWG
Carte sous l'éditeur de courant admissible, indépendante du calcul (non mémorisée). Saisir dans un champ remplit l'autre en temps réel.

| Saisie | Résultat |
|---|---|
| Section en mm² | Le champ AWG reçoit la taille correspondante (à ±1 %), sinon la plus petite taille ≥. La ligne dessous donne la fourchette, ex. « Entre AWG 14 (2,081 mm²) et AWG 12 (3,309 mm²) ». |
| AWG ou kcmil (`12`, `#12`, `AWG 12`, `1/0`…`4/0`, `00`, `250 kcmil`, `250 MCM`) | Le champ mm² reçoit la section (3 décimales). La ligne dessous donne la section, le diamètre et la plus petite section métrique normalisée ≥. |

L'équivalence est purement géométrique : une même section ne garantit pas le même courant admissible.

## 7. Tables de courant admissible

- Une table par **matériau – isolant – méthode de référence – conducteurs chargés** (ex. `cu-pvc-B2-2`), 72 au total.
- Valeurs normalisées : **IEC 60364-5-52:2009 annexe B**, tableaux B.52.2 à B.52.5 (méthodes A1 à D2) et B.52.10 à
  B.52.13 (E, F). Conditions de référence : 30 °C à l'air, 20 °C dans le sol, résistivité thermique du sol 2,5 K·m/W.
  Transcrites de deux reproductions indépendantes de la norme et recoupées cellule par cellule (données du 2026-10-06).
- Certaines cases sont vides dans la norme : aluminium D2 en dessous de 16 mm², méthode F en dessous de 25 mm². Une note
  s'affiche quand la section retenue est la première de sa table.
- **Modification** : ouvrez « Table de courant admissible Iz », changez une valeur → une copie personnalisée de la table
  est créée et enregistrée dans le navigateur. « Restaurer les valeurs normalisées » supprime la copie. « Vider cette
  table » la vide (deux clics pour confirmer).
- **Exporter JSON** : télécharge toutes les tables effectives (normalisées + personnalisées). **Importer JSON** : charge
  des tables comme tables personnalisées. Format :

```json
{
  "cu-pvc-C-2": { "1.5": 19.5, "2.5": 27, "4": 36 },
  "al-xlpe-E-3": { "16": 77, "25": 97 }
}
```

Clés : matériau `cu`/`al`, isolant `pvc`/`xlpe`, méthode `A1 A2 B1 B2 C D1 D2 E F`, conducteurs chargés `2`/`3`.

## 8. Avertissements

| Avertissement | Signification / action |
|---|---|
| La chute réactive seule dépasse la limite | Aucune section ne peut respecter la chute de tension : raccourcir la ligne, augmenter la tension ou la limite. |
| Au-delà de 630 mm² | Envisager des conducteurs en parallèle. |
| La table Iz est vide | Le critère de courant admissible / protection est ignoré : remplir ou restaurer la table. |
| Le courant d'emploi dépasse In / In > Iz' | Coordination de la protection non respectée : changer In ou la section. |
| La température estimée dépasse θmax | La section retenue surchauffe dans les conditions indiquées. |
| Effet de peau | La résistance en alternatif est supérieure à la valeur continue utilisée : prévoir une marge. |
| Paroi isolée thermiquement | Câble en contact avec l'isolant thermique sur une certaine longueur : facteur supplémentaire jusqu'à 0,5 (IEC 60364-5-52, 523.9), non appliqué. |
| Câble gainé exigé | Les conducteurs isolés sans gaine doivent passer sous conduit ou goulotte. |
| Modèle thermique / air libre | Le modèle thermique est optimiste hors méthodes E et F. |
| Pose hors norme | « Dans un meuble en bois » : la méthode A1/A2 est une hypothèse. |
| La table commence à … | Les sections inférieures ne sont pas couvertes par la norme pour cette méthode (ex. F à partir de 25 mm²). |
| Courant admissible d'après les valeurs normalisées | Rappel de la source et de la version des données. |

## 9. Exemples chiffrés

### 9.1 Continu 12 V, 10 A, 5 m, ΔU 3 %
Entrées : continu, 12 V, 10 A, 5 m, cuivre, résistivité « Convention IEC » avec ρ20 = 0,018 (ρ = 0,0225), chute de
tension 3 %. ΔUmax = 0,36 V → S = 2 × 0,0225 × 5 × 10 / 0,36 = **6,25 mm² → 10 mm²**. Chute réelle avec 10 mm² :
2 × 0,0225 × 5 × 10 / 10 = 0,225 V (1,9 %).

### 9.2 Monophasé 230 V, 16 A, 20 m (paramètres par défaut)
Cuivre PVC fixé apparent (méthode C, 2 conducteurs chargés), 30 °C, ρ à 70 °C = 0,02063, cos φ 0,9, x 0,08 mΩ/m.
- Chute de tension 3 % (6,9 V) : requise 1,73 mm² → 2,5 mm².
- Pertes 2 % de 3312 W (66,2 W) : requise 3,19 mm² → **4 mm² (dimensionnant)**.
- Courant admissible : 1,5 mm² (Iz = 19,5 A ≥ 16 A).
Résultat **4 mm²** : ΔU = 2,99 V (1,3 %), pertes 52,8 W (1,6 %), conducteur à environ 38 °C, longueur max 25 m (pertes).

### 9.3 Triphasé 400 V, 40 A, 30 m en paroi isolée
Câble cuivre PVC multiconducteur en paroi isolée thermiquement (méthode A2, 3 conducteurs chargés), ambiante 35 °C +
marge 5 K, 2 circuits en faisceau (groupement 0,80), protection 40 A.
kθ = √((70 − 40)/(70 − 30)) = 0,866 ; facteur total 0,693.
- 16 mm² : Iz = 52 A → Iz' = 36,0 A < 40 A. 25 mm² : Iz = 68 A → Iz' = 47,1 A ≥ 40 A.
- Chute de tension 3 % (12 V) : 3,06 mm² → 4 mm².
Résultat **25 mm²**, dimensionné par le courant admissible (c'est l'environnement thermique, pas la longueur, qui
dimensionne ce câble).

## 10. Limites

- Outil indicatif ; la norme nationale prévaut (RGIE, NF C 15-100…).
- Facteur de groupement saisi à la main ; déclassement supplémentaire au contact d'un isolant thermique seulement signalé.
- Résistivité thermique du sol fixée à 2,5 K·m/W pour D1/D2 (pas de correction pour d'autres sols).
- Résistance en alternatif prise égale à la résistance en continu ; effet de proximité ignoré.
- Pas de vérification de la boucle de défaut (protection des personnes, longueur maximale pour les contacts indirects).
- Pas de correction pour les harmoniques (neutre chargé par l'harmonique 3 en triphasé).
- Pas de conducteurs en parallèle au-delà de 630 mm².
- Équivalent AWG uniquement géométrique : le courant admissible des câbles AWG (NEC / UL) n'est pas calculé ; jauges impaires (5, 7, 9…) non proposées.

## 11. Références et glossaire

- IEC 60364-5-52:2009 — Choix et mise en œuvre des matériels électriques — Canalisations (annexe B : courants admissibles).
- IEC 60364-4-43 — Protection contre les surintensités.
- IEC 60228 — Âmes des câbles isolés (sections normalisées, résistances).
- IEC 60949 — Calcul des courants de court-circuit admissibles thermiquement (facteur k).
- RGIE (Belgique), NF C 15-100 (France).

| Terme | Définition |
|---|---|
| Ib / I | Courant d'emploi du circuit. |
| Iz | Courant admissible du câble dans les conditions de référence ; Iz' après corrections. |
| In | Courant assigné (calibre) de la protection. |
| θmax | Température permanente maximale du conducteur admise par l'isolant. |
| θcalc | Ambiante de calcul = ambiante max + marge de sécurité. |
| Conducteurs chargés | Conducteurs parcourus par le courant : 2 en continu/monophasé, 3 en triphasé équilibré. |
| Méthode de référence | Condition de pose normalisée de l'IEC 60364-5-52 (A1 … G). |

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
