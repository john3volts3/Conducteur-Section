# FSD — Cable Sizer

## 1. Objet
Application web mono-page (HTML/CSS/JS vanilla, aucune dépendance, aucun build) qui calcule la section
d'un conducteur selon plusieurs critères et retient la section normalisée (IEC 60228) la plus contraignante.
Fonctionne hors ligne en `file://` et sur tout hébergeur statique. Interface bilingue anglais (défaut) / français.

Fichiers à déployer ensemble :
- `index.html` : page, styles et logique ;
- `i18n.js` : tous les textes affichés (objet `I18N` par langue). Fichier `.js` et non `.json` car `fetch()` d'un JSON est bloqué en `file://`.
- `iz-data.js` : courants admissibles normalisés (objet `IZ_DEFAULTS`, 72 tables IEC 60364-5-52:2009 annexe B, `version` = date des données). Optionnel : sans lui, les tables Iz sont vides.

Autres fichiers du dépôt : `grouping-data.js` (facteurs de groupement IEC B.52.17–B.52.19, non utilisés par l'app),
`README.md` / `README.fr.md`, `docs/MANUAL.en.md` / `docs/MANUEL.fr.md` (manuel utilisateur et technique), `.vercelignore` (seuls les 3 fichiers de l'app sont publiés sur Vercel).

## 2. Entrées
| Groupe | Entrée | Défaut | Validation |
|---|---|---|---|
| System & load | System : DC / AC single-phase / AC three-phase | AC 1~ | — |
| | Voltage U (V) | 230 | > 0 |
| | Load given as : Current I (A) ou Active power P (W) | I = 16 | > 0 |
| | Power factor cos φ (AC) | 0,9 | 0 < cos φ ≤ 1 |
| Line | Cable length, one way L (m) — longueur du câble ; le conducteur de retour est inclus par les formules (×2 DC/1~, ×√3 3~) | 20 | > 0 |
| | Reactance x (mΩ/m, AC) | 0,08 | ≥ 0 |
| | Frequency f (Hz, AC) | 50 | > 0 |
| Installation | Installation type (12 poses concrètes + « Autre ») | Fixé apparent (C) | — |
| | Cable type : multiconducteur / unipolaire | multiconducteur | — |
| | Reference method A1…F (si « Autre ») | C | — |
| | Max ambient θamb,max (°C) (température du sol pour D1/D2) | 30 | −60…200 |
| | Safety margin (K) | 0 | 0…100 ; θcalc = θamb,max + marge < θmax |
| | Grouping factor | 1 | 0 < f ≤ 1 |
| | kθ manuel (vide = auto) | auto | > 0 |
| Conductor | Material Cu / Al | Cu | — (fixe ρ20, α par défaut) |
| | Insulation PVC 70 °C / XLPE-EPR 90 °C | PVC | — (fixe θmax par défaut) |
| | θmax (°C) | 70 | 0 < θ ≤ 400 |
| | Resistivity : à θmax de l'isolant (auto), à une température saisie, ou convention IEC 1,25·ρ20 | à θmax | — |
| | Conductor temperature (°C), mode manuel uniquement | 70 | −60…400 |
| | ρ20 (Ω·mm²/m) | Cu 0,017241 / Al 0,028264 | > 0 |
| | α (1/K) | Cu 0,00393 / Al 0,00403 | ≥ 0 |
| Criteria | Max voltage drop (V ou %) | 3 % | > 0 |
| | Max power loss (W ou % de P) | 2 % | > 0 |
| | Max heating : h (W/m²·K) | désactivé, 10 | > 0 |
| | Ampacity (table Iz) | activé | valeurs normalisées si disponibles |
| | Short-circuit : Isc (A), t (s), k (auto/manuel) | désactivé, 3000 A, 0,1 s | > 0 |
| | Protection rating In (A) | désactivé, 16 A | > 0 |

## 3. Formules (unités mm², m, A, V, Ω·mm²/m, x en Ω/m)
- b = 2 (DC, 1~), √3 (3~) ; n = 2 (DC, 1~), 3 (3~) ; m = 1 (DC, 1~), √3 (3~). En DC : cos φ = 1, sin φ = 0, x = 0.
- ρ(T) = ρ20·(1 + α(T − 20)) avec T = θmax (défaut) ou T saisie ; option IEC : ρ = 1,25·ρ20.
- **Ambiante de calcul** : θcalc = θamb,max + marge de sécurité (K). Utilisée pour kθ, l'échauffement et la température estimée.
- I = P / (m·U·cos φ) ; P = m·U·I·cos φ.
- **Chute de tension** : S = b·ρ·L·I·cos φ / (ΔUmax − b·L·I·x·sin φ). Dénominateur ≤ 0 → erreur signalée.
- **Pertes** : S = n·ρ·L·I² / Pmax.
- **Échauffement (modèle)** : I²ρ/S = h·π·D·ΔT, D = 2√(S/π) → S = (I²·ρ(θmax) / (2√π·h·ΔT·10⁻³))^(2/3), ΔT = θmax − θcalc.
- **Méthode de référence** : déduite du type de pose et du type de câble (IEC 60364-5-52 tableau B.52.3) :
  noyé maçonnerie C ; conduit encastré B1/B2 ; goulotte B1/B2 ; cloison creuse B1/B2 ; paroi isolée A1/A2 ;
  moulure/enceinte bois A1/A2 ; meuble en bois A1/A2 (hypothèse prudente, hors norme) ; fixé apparent C ;
  conduit en chape B1/B2 ; enterré sous fourreau D1 ; enterré direct D2 ; chemin de câbles perforé F (unipolaire) / E (multi).
  Conducteurs chargés : 2 (DC, 1~), 3 (3~).
- **Admissibilité** : plus petite section normalisée telle que Iz·kθ·kgroup ≥ I, Iz lu dans la table (matériau, isolant, méthode, conducteurs chargés) ; kθ = √((θmax − θcalc)/(θmax − θref)), θref = 30 °C à l'air, 20 °C enterré (D1/D2).
- **Protection** : I ≤ In ; plus petite section telle que Iz·kθ·kgroup ≥ In.
- **Court-circuit** : S = Isc·√t / k ; k auto 115 / 143 / 76 / 94 (Cu-PVC / Cu-XLPE / Al-PVC / Al-XLPE),
  PVC > 300 mm² : 103 (Cu) / 68 (Al). Affichage informatif de k = K·√ln((β+θf)/(β+θi)) (IEC 60949 ; Cu K=226, β=234,5 ; Al K=148, β=228).
- **Section finale** : max des sections normalisées des critères valides ; critère dimensionnant mis en évidence.

## 4. Sorties
- Tableau Criterion / Required / Standard / Status (OK, Error, No data, Fail, Governing).
- Section recommandée + critère dimensionnant. La carte de résultat est partagée en deux moitiés égales :
  section métrique (mm²) | équivalent AWG.
- **Équivalent AWG** affiché partout où une section apparaît (carte de résultat, colonnes Requise/Normalisée,
  pastille mobile, avertissements, éditeur Iz, rapport copié, au format `2,5 mm² / AWG 12`) : plus petite taille listée
  dont la section est ≥ la section métrique. Tailles listées : AWG 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1, 1/0…4/0,
  puis 250…2000 kcmil (1 kcmil = 0,5067 mm²). Section AWG : d = 0,127·92^((36 − n)/39) mm, S = π·d²/4 (1/0 = 0 … 4/0 = −3).
  Au-delà de 2000 kcmil : « > 2000 kcmil ».
- Pour la section retenue : ΔU (V, %), pertes (W, % de P), température estimée du conducteur
  (θ = θcalc + (θmax − θcalc)·(I/Iz')² si Iz connu, sinon bilan thermique en forme fermée avec ρ(θ)),
  longueur max (ΔUmax et/ou Pmax), Iz' si protection, profondeur de peau δ = √(ρ/(π f μ0)) vs rayon √(S/π) (AC).
- Avertissements : ΔU AC impossible, I > In, In > Iz', température > θmax, effet de peau, table Iz vide, section > 630 mm².
- Bouton « Copy results » : rapport texte complet dans le presse-papiers.

## 4bis. Convertisseur mm² ⇄ AWG
- Carte indépendante du calcul (non mémorisée), sous l'éditeur Iz, deux champs avec leur résultat.
  Saisir dans un champ remplit l'autre en temps réel (mm² → taille AWG correspondante, sinon plus petite ≥ ; AWG → mm² à 3 décimales) ;
  saisie vide ou invalide → l'autre champ est vidé.
  - **mm² → AWG** : correspondance si une taille listée est à ±1 % (« ≈ AWG 14 (2,081 mm²) ») ; sinon fourchette
    « Entre AWG 14 (2,081 mm²) et AWG 12 (3,309 mm²) » et plus petite taille ≥ ; hors liste : en dessous de AWG 24 / au-delà de 2000 kcmil.
  - **AWG → mm²** : accepte `12`, `AWG 12`, `#12`, `1/0`…`4/0`, `0`…`0000`, `250 kcmil`, `250 MCM` (AWG 40 à 4/0, kcmil quelconque) ;
    affiche la section, le diamètre et la plus petite section métrique normalisée ≥.
- Équivalence géométrique uniquement (aide `help.awg`) : même section ≠ même courant admissible.

## 5. Langue et saisie des nombres
- Bouton de langue dans la barre du haut (affiche la langue suivante). Choix mémorisé (`cableSizer.lang`), anglais au premier lancement.
- Mécanisme : attributs `data-i18n="clé"` (texte) et `data-i18n-attr="attribut:clé;…"` dans le HTML ; fonction `t(clé, {param})`
  côté JS avec repli langue courante → anglais → clé. Aucun texte affiché en dur dans le code ; les formules restent dans le HTML (neutres).
- Changer de langue retraduit l'interface et relance le calcul (résultats, avertissements et rapport copié dans la langue choisie).
- Nombres affichés au format de la langue (fr : `6,25`, en : `6.25`).
- Saisie : champs texte (`inputmode="decimal"`), `parseNumber()` accepte `.` ou `,` dans toutes les langues ; pas de séparateur
  de milliers (`1,500` = 1,5) ; notation `1e-3` acceptée. Les champs de température gardent le clavier standard (signe moins sur iOS).
- Ajouter une langue : copier le bloc `en` de `i18n.js` sous un nouveau code et ajouter la locale dans `LOCALES` (`index.html`).

## 5quater. Manuel
- Bouton « Manual / Manuel » dans la barre du haut et lien en pied de page : ouvrent dans un nouvel onglet le manuel
  GitHub de la langue courante (`docs/MANUAL.en.md` / `docs/MANUEL.fr.md`, constante `MANUAL_URLS`).

## 5ter. Avertissement de non-garantie
- Bandeau permanent (non masquable) sous l'en-tête : valeurs indicatives non garanties, vérification obligatoire,
  responsabilité entière de l'utilisateur, aucune responsabilité de l'auteur. Repris dans le pied de page,
  en tête et en fin du texte copié, et en tête / fin des README et manuels (EN/FR).

## 5bis. Aide contextuelle
- 34 libellés portent un attribut `data-help="help.<clé>"` (paramètres spécifiques, critères, colonnes Requise/Normalisée).
- Un bouton « i » est ajouté après chaque libellé ; une bulle unique `#helpTip` (role tooltip) affiche le texte traduit.
- Affichage : survol du libellé ou du « i » (souris), focus clavier sur le « i », clic/tap sur le « i » (épinglée).
  Fermeture : sortie de la souris, Échap, clic ailleurs, défilement, redimensionnement. Le clic sur le « i » d'un critère
  ne coche pas sa case. Positionnée sous le libellé, ou au-dessus si elle déborde de l'écran.
- Textes : clés `help.*` dans `i18n.js` (EN/FR) ; le test de cohérence des clés couvre aussi `data-help`.

## 6. Tables de courant admissible
- Une table par clé `matériau-isolant-méthode-conducteurs chargés` (ex. `cu-pvc-B2-2`), sections 1,5…630 mm².
- Valeurs normalisées (`iz-data.js`) : IEC 60364-5-52:2009 annexe B, tableaux B.52.2–B.52.5 (A1…D2) et B.52.10–B.52.13 (E, F),
  transcrites de deux reproductions indépendantes (Top Cable, TiSoft) recoupées cellule par cellule, ABB en 3e contrôle.
  Source et version des données (« IEC 60364-5-52:2009 Annex B — data of 2026-10-06 ») affichées dans l'éditeur,
  l'avertissement « valeurs normalisées » et le rapport copié.
  Cellules vides de la norme omises (Al D2 < 16 mm², F < 25 mm²) ; avertissement si la section retenue est la 1re de la table.
- Particularité conservée : Al PR/XLPE 25–120 mm², méthode C légèrement inférieure à B1 (identique dans les deux sources).
- Modifier une valeur crée une table personnalisée (copie des valeurs normalisées) ; « Restore standard values » la supprime ;
  « Clear this table » la vide ; export = toutes les tables effectives ; import = tables personnalisées.

## 7. Persistance
localStorage (avec try/catch, l'app fonctionne sans) : `cableSizer.settings.v1` (paramètres), `cableSizer.izTables.v2`
(tables Iz personnalisées par clé matériau-isolant-méthode-conducteurs ; l'ancienne clé v1 est ignorée), `cableSizer.theme` (auto/light/dark), `cableSizer.lang` (en/fr).
Reset restaure les paramètres par défaut sans effacer les tables Iz.

## 8. Tests
`index.html?test` : 60 auto-tests en console (`console.assert` + `console.table`) et bandeau récapitulatif :
calculs, méthodes de référence, données Iz (nombre de tables, croissance, valeurs témoins), `parseNumber` (virgule/point, rejets), AWG (sections, ≥, fourchette, `parseAwg`), cohérence des clés de traduction entre langues et avec le HTML. Dont DC 12 V/10 A/5 m/ρ 0,0225/3 % → 6,25 → 10 mm² ; Isc 3000 A/0,1 s/k 115 → 8,25 → 10 mm² ; k Cu/PVC ≈ 115.

## 9. Limites
- Outil indicatif, ne remplace pas la norme (RGIE, NF C 15-100, IEC 60364) ni un professionnel qualifié.
- Valeurs Iz transcrites de reproductions de la norme : à vérifier avec l'édition applicable (RGIE, NF C 15-100).
- Facteur de groupement saisi à la main (tableaux B.52.17–B.52.19 disponibles dans `grouping-data.js`, non utilisés) ; facteur « contact avec isolant thermique »
  (jusqu'à 0,5, 523.9) seulement signalé ; résistivité thermique du sol fixe 2,5 K·m/W pour D1/D2.
- Pose « meuble en bois » absente de la norme : méthode A1/A2 par hypothèse prudente.
- Modèle thermique : conducteur nu seul à l'air libre ; ignore isolant, mode de pose, câbles voisins, rayonnement séparé.
- Résistance AC = résistance DC (effet de peau/proximité seulement signalés).
- Pas de vérification de la boucle de défaut (protection des personnes) ni de la longueur max en court-circuit minimal.
- Sections > 630 mm² : signalées, conducteurs en parallèle non calculés.
- Équivalent AWG purement géométrique : l'admissibilité d'un câble AWG relève d'autres normes (NEC/UL) et n'est pas calculée ; jauges AWG impaires (5, 7, 9…) non proposées comme équivalent.

## 10. Déploiement
- Hébergement statique : `index.html`, `i18n.js`, `iz-data.js`.
- Vercel : https://conducteur-section.vercel.app/ — projet importé depuis le dépôt GitHub public https://github.com/john3volts3/Conducteur-Section (licence MIT), preset « Other », sans build ; chaque push sur `main` redéploie.
  `.vercelignore` (liste blanche) empêche la publication des documents internes.
