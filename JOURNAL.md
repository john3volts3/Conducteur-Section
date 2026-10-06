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

Décisions validées par l'utilisateur :
- ρ20 modifiable (le test DC utilise ρ = 0,0225 directement dans la fonction pure).
- Longueur max = longueur respectant ΔUmax et Pmax pour la section retenue.
- kθ calculé par √((θmax − θamb)/(θmax − 30)), surchargeable à la main.
- k PVC > 300 mm² : 103 (Cu) / 68 (Al) appliqué automatiquement.
- Ajout d'un critère « échauffement » par bilan thermique (h modifiable, défaut 10 W/m²·K).
- Fichier de traduction nommé `i18n.js` (JS et non JSON pour fonctionner en `file://`), anglais par défaut.
- Séparateur décimal point ou virgule accepté quelle que soit la langue.
