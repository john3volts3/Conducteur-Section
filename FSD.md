# FSD — Cable Sizer

## 1. Objet
Application web mono-page (HTML/CSS/JS vanilla, aucune dépendance, aucun build) qui calcule la section
d'un conducteur selon plusieurs critères et retient la section normalisée (IEC 60228) la plus contraignante.
Fonctionne hors ligne en `file://` et sur tout hébergeur statique. Interface bilingue anglais (défaut) / français.

Fichiers à déployer ensemble :
- `index.html` : page, styles et logique ;
- `i18n.js` : tous les textes affichés (objet `I18N` par langue). Fichier `.js` et non `.json` car `fetch()` d'un JSON est bloqué en `file://`.

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
| Conductor | Material Cu / Al | Cu | — (fixe ρ20, α par défaut) |
| | Insulation PVC 70 °C / XLPE-EPR 90 °C | PVC | — (fixe θmax par défaut) |
| | θmax (°C) | 70 | 0 < θ ≤ 400 |
| | Resistivity : à la température du conducteur, ou convention IEC 1,25·ρ20 | température | — |
| | Conductor temperature (°C) | 70 | −60…400 |
| | ρ20 (Ω·mm²/m) | Cu 0,017241 / Al 0,028264 | > 0 |
| | α (1/K) | Cu 0,00393 / Al 0,00403 | ≥ 0 |
| Installation | Ambient θamb (°C) | 30 | < θmax |
| | Grouping factor | 1 | 0 < f ≤ 1 |
| | kθ manuel (vide = auto) | auto | > 0 |
| Criteria | Max voltage drop (V ou %) | 3 % | > 0 |
| | Max power loss (W ou % de P) | 2 % | > 0 |
| | Max heating : h (W/m²·K) | 10 | > 0 |
| | Ampacity (table Iz) | désactivé | table vide par défaut |
| | Short-circuit : Isc (A), t (s), k (auto/manuel) | désactivé, 3000 A, 0,1 s | > 0 |
| | Protection rating In (A) | désactivé, 16 A | > 0 |

## 3. Formules (unités mm², m, A, V, Ω·mm²/m, x en Ω/m)
- b = 2 (DC, 1~), √3 (3~) ; n = 2 (DC, 1~), 3 (3~) ; m = 1 (DC, 1~), √3 (3~). En DC : cos φ = 1, sin φ = 0, x = 0.
- ρ(T) = ρ20·(1 + α(T − 20)) ; option IEC : ρ = 1,25·ρ20.
- I = P / (m·U·cos φ) ; P = m·U·I·cos φ.
- **Chute de tension** : S = b·ρ·L·I·cos φ / (ΔUmax − b·L·I·x·sin φ). Dénominateur ≤ 0 → erreur signalée.
- **Pertes** : S = n·ρ·L·I² / Pmax.
- **Échauffement (modèle)** : I²ρ/S = h·π·D·ΔT, D = 2√(S/π) → S = (I²·ρ(θmax) / (2√π·h·ΔT·10⁻³))^(2/3), ΔT = θmax − θamb.
- **Admissibilité** : plus petite section normalisée telle que Iz·kθ·kgroup ≥ I ; kθ = √((θmax − θamb)/(θmax − 30)).
- **Protection** : I ≤ In ; plus petite section telle que Iz·kθ·kgroup ≥ In.
- **Court-circuit** : S = Isc·√t / k ; k auto 115 / 143 / 76 / 94 (Cu-PVC / Cu-XLPE / Al-PVC / Al-XLPE),
  PVC > 300 mm² : 103 (Cu) / 68 (Al). Affichage informatif de k = K·√ln((β+θf)/(β+θi)) (IEC 60949 ; Cu K=226, β=234,5 ; Al K=148, β=228).
- **Section finale** : max des sections normalisées des critères valides ; critère dimensionnant mis en évidence.

## 4. Sorties
- Tableau Criterion / Required / Standard / Status (OK, Error, No data, Fail, Governing).
- Section recommandée + critère dimensionnant.
- Pour la section retenue : ΔU (V, %), pertes (W, % de P), température estimée du conducteur
  (θ = θamb + (θmax − θamb)·(I/Iz')² si Iz connu, sinon bilan thermique en forme fermée avec ρ(θ)),
  longueur max (ΔUmax et/ou Pmax), Iz' si protection, profondeur de peau δ = √(ρ/(π f μ0)) vs rayon √(S/π) (AC).
- Avertissements : ΔU AC impossible, I > In, In > Iz', température > θmax, effet de peau, table Iz vide, section > 630 mm².
- Bouton « Copy results » : rapport texte complet dans le presse-papiers.

## 5. Langue et saisie des nombres
- Bouton de langue dans la barre du haut (affiche la langue suivante). Choix mémorisé (`cableSizer.lang`), anglais au premier lancement.
- Mécanisme : attributs `data-i18n="clé"` (texte) et `data-i18n-attr="attribut:clé;…"` dans le HTML ; fonction `t(clé, {param})`
  côté JS avec repli langue courante → anglais → clé. Aucun texte affiché en dur dans le code ; les formules restent dans le HTML (neutres).
- Changer de langue retraduit l'interface et relance le calcul (résultats, avertissements et rapport copié dans la langue choisie).
- Nombres affichés au format de la langue (fr : `6,25`, en : `6.25`).
- Saisie : champs texte (`inputmode="decimal"`), `parseNumber()` accepte `.` ou `,` dans toutes les langues ; pas de séparateur
  de milliers (`1,500` = 1,5) ; notation `1e-3` acceptée. Les champs de température gardent le clavier standard (signe moins sur iOS).
- Ajouter une langue : copier le bloc `en` de `i18n.js` sous un nouveau code et ajouter la locale dans `LOCALES` (`index.html`).

## 6. Persistance
localStorage (avec try/catch, l'app fonctionne sans) : `cableSizer.settings.v1` (paramètres), `cableSizer.izTables.v1`
(une table Iz par couple matériau/isolant, export/import JSON), `cableSizer.theme` (auto/light/dark), `cableSizer.lang` (en/fr).
Reset restaure les paramètres par défaut sans effacer les tables Iz.

## 7. Tests
`index.html?test` : 29 auto-tests en console (`console.assert` + `console.table`) et bandeau récapitulatif :
calculs, `parseNumber` (virgule/point, rejets), cohérence des clés de traduction entre langues et avec le HTML. Dont DC 12 V/10 A/5 m/ρ 0,0225/3 % → 6,25 → 10 mm² ; Isc 3000 A/0,1 s/k 115 → 8,25 → 10 mm² ; k Cu/PVC ≈ 115.

## 8. Limites
- Outil indicatif, ne remplace pas la norme (RGIE, NF C 15-100, IEC 60364) ni un professionnel qualifié.
- Aucune valeur Iz fournie : l'utilisateur doit remplir la table selon son mode de pose.
- Modèle thermique : conducteur nu seul à l'air libre ; ignore isolant, mode de pose, câbles voisins, rayonnement séparé.
- Résistance AC = résistance DC (effet de peau/proximité seulement signalés).
- Pas de vérification de la boucle de défaut (protection des personnes) ni de la longueur max en court-circuit minimal.
- Sections > 630 mm² : signalées, conducteurs en parallèle non calculés.
