# Journal des modifications — Cable Sizer

## Session du 2026-10-06

| Heure | Fichier | Modification |
|---|---|---|
| 2026-10-06 | `index.html` | Création de l'application mono-fichier « Cable Sizer » (HTML/CSS/JS inline, sans dépendance) : critères chute de tension, pertes, échauffement (modèle thermique), admissibilité (table Iz éditable), court-circuit, protection In ; réactance, effet de peau ; synthèse pour la section retenue ; thème clair/sombre, Reset, Copy results, localStorage ; auto-tests `?test`. |
| 2026-10-06 | `JOURNAL.md` | Création du journal. |
| 2026-10-06 | `FSD.md` | Création de la spécification fonctionnelle (formules, entrées/sorties, limites). |
| 2026-10-06 | `i18n.js` | Création : textes EN/FR de toute l'interface (clés structurées, paramètres `{v}`). |
| 2026-10-06 | `index.html` | Bilingue : bouton de langue, attributs `data-i18n` / `data-i18n-attr`, fonction `t()`, plus aucun texte en dur ; nombres affichés selon la langue ; champs numériques en texte + `parseNumber()` (point ou virgule) ; échappement HTML des rendus ; +13 auto-tests (parse, parité des traductions). |
| 2026-10-06 | `index.html`, `i18n.js` | Libellé « Cable length, one way » + aide : saisir la longueur du câble, le retour est inclus (×2 DC/1~, ×√3 3~). |
| 2026-10-06 | `FSD.md` | Section langue / saisie des nombres, fichiers à déployer, 29 tests. |
| 2026-10-06 | `index.html` | Carte « Installation / Pose » déplacée avant « Conductor » ; ambiante renommée « max » + champ « Safety margin (K) » (défaut 0) ; ambiante de calcul θcalc = θamb,max + marge utilisée pour kθ, échauffement et température estimée ; nouveau mode ρ « à θmax de l'isolant » (défaut) ; +3 auto-tests (32). |
| 2026-10-06 | `i18n.js` | Clés EN/FR : marge de sécurité, ambiante de calcul, mode ρ à θmax ; libellés ambiante max, erreur θcalc ≥ θmax, rapport. |
| 2026-10-06 | `FSD.md` | Entrées Pose, θcalc dans les formules, mode ρ par défaut, 32 tests. |
| 2026-10-06 | `index.html` | Type de pose (12 poses + « Autre » / méthode manuelle), type de câble, méthode de référence IEC affichée ; θref 20 °C pour D1/D2 ; tables Iz par matériau-isolant-méthode-conducteurs chargés (stockage v2) avec valeurs normalisées par défaut, « Restore standard values » ; avertissements paroi isolée, câble gainé requis, modèle thermique hors air libre, pose hors norme, début de table ; défauts : Ampacity activé, Heating désactivé ; +13 auto-tests (45). |
| 2026-10-06 | `iz-data.js` | Création : 72 tables Iz IEC 60364-5-52:2009 annexe B (1080 valeurs, recoupées sur 2 sources). |
| 2026-10-06 | `i18n.js` | Clés EN/FR : types de pose, types de câble, méthodes, sources Iz, nouveaux avertissements, rapport. |
| 2026-10-06 | `FSD.md` | Méthodes de référence, tables Iz normalisées, persistance v2, 45 tests, limites. |

Décisions validées par l'utilisateur :
- ρ20 modifiable (le test DC utilise ρ = 0,0225 directement dans la fonction pure).
- Longueur max = longueur respectant ΔUmax et Pmax pour la section retenue.
- kθ calculé par √((θmax − θamb)/(θmax − 30)), surchargeable à la main.
- k PVC > 300 mm² : 103 (Cu) / 68 (Al) appliqué automatiquement.
- Ajout d'un critère « échauffement » par bilan thermique (h modifiable, défaut 10 W/m²·K).
- Fichier de traduction nommé `i18n.js` (JS et non JSON pour fonctionner en `file://`), anglais par défaut.
- Séparateur décimal point ou virgule accepté quelle que soit la langue.
- Température : ambiante max seule + marge de sécurité en K (θcalc = θamb,max + marge), ρ calculée à θmax de l'isolant par défaut.
- Type de pose → méthode de référence IEC (tableau B.52.3) ; « meuble en bois » ajouté et traité en A1/A2 (prudent).
- Tables Iz préremplies avec les valeurs IEC 60364-5-52 annexe B (demande utilisateur), modifiables par table.
