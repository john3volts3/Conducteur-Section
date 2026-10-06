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
| 2026-10-06 | `iz-data.js`, `index.html`, `i18n.js` | Version des données Iz (`version: '2026-10-06'`) affichée dans l'éditeur, l'avertissement et le rapport copié (ligne « Ampacity data »). |
| 2026-10-06 | `grouping-data.js` | Création : facteurs de groupement IEC B.52.17 / B.52.18 / B.52.19 (recoupés sur 2 sources), conservés pour une évolution future, non chargés par l'app. |
| 2026-10-06 | `.vercelignore` | Création : liste blanche, seuls `index.html`, `i18n.js`, `iz-data.js` sont publiés sur Vercel. |
| 2026-10-06 | `README.md`, `README.fr.md` | Création : présentation de l'outil EN / FR avec lien croisé. |
| 2026-10-06 | `FSD.md`, `JOURNAL.md` | Livraison : fichiers, version des données, déploiement. |
| 2026-10-06 | `README.md`, `README.fr.md`, `FSD.md` | Lien de l'app en ligne https://conducteur-section.vercel.app/ (déploiement vérifié : 45/45 tests en ligne, documents internes en 404). |
| 2026-10-06 | `index.html` | Aide contextuelle : bouton « i » et bulle au survol / focus / tap sur 31 libellés (`data-help`), fermeture Échap / clic ailleurs, test de clés étendu à `data-help`. |
| 2026-10-06 | `i18n.js` | 32 clés `help.*` EN/FR (explications techniques des paramètres, critères et colonnes). |
| 2026-10-06 | `docs/MANUAL.en.md`, `docs/MANUEL.fr.md` | Création : manuel utilisateur et technique détaillé (paramètres, formules, résultats, tables Iz, avertissements, 3 exemples chiffrés vérifiés, limites, glossaire). |
| 2026-10-06 | `README.md`, `README.fr.md` | Section « Paramètres » détaillée + liens vers le manuel. |
| 2026-10-06 | `FSD.md` | Section aide contextuelle, fichiers du manuel. |
| 2026-10-06 | `index.html`, `i18n.js` | Avertissement « aucune garantie / responsabilité de l'utilisateur » : bandeau permanent en haut de l'app, pied de page, en tête et en fin du texte copié (EN/FR). |
| 2026-10-06 | `README.md`, `README.fr.md`, `docs/MANUAL.en.md`, `docs/MANUEL.fr.md` | Encadré d'avertissement « aucune garantie » en tête et en fin de document. |

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
- Facteurs de groupement normalisés abandonnés dans l'UI (saisie manuelle conservée) ; tables vérifiées gardées dans `grouping-data.js`.
- Pas de bouton de mise à jour des valeurs Iz : version des données affichée à la place.
- Déploiement Vercel depuis GitHub (dépôt privé), `.vercelignore` en liste blanche.
