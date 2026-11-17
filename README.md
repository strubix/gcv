# gcv, un CV taillé pour chaque annonce

Skill [Claude Code](https://claude.com/claude-code) qui écrit un CV pour **une** offre
d'emploi précise, puis le met à l'épreuve d'un débat contradictoire entre deux agents :

- un **avocat** défend le CV et vérifie qu'il exploite tout ce qui est réellement disponible ;
- un **challenger** l'attaque avec quatre regards successifs : recruteur qui trie en
  30 secondes, filtre ATS, tech lead qui fera l'entretien, RH.

Claude arbitre, applique ce qui est traçable et écarte le reste. Aucune expérience, techno ou
chiffre n'est inventé : chaque ligne du CV renvoie à un fait de ton référentiel.

## Ce que tu obtiens

| Fichier | Contenu |
|---|---|
| `CV-<Prenom>-<Nom>-<entreprise>-<lang>.pdf` | le CV à envoyer, A4, vérifié page par page |
| `CV-...html` | la source, pour les retouches |
| `debat-<entreprise>.md` | les questions qui vont tomber en entretien, et les réponses que le CV prépare |
| `gaps-<entreprise>.md` | ce que l'annonce demande et que tu ne peux pas prouver |

Le CV est écrit dans la langue de l'annonce (FR ou EN). Une mesure de densité de la page
rendue (débordement, longueur de ligne, part de gras, vide de colonne) évite le CV juste sur
le fond mais illisible.

## Installation

Prérequis : [Claude Code](https://claude.com/claude-code), [Bun](https://bun.sh), et Chrome,
Chromium ou Edge.

```bash
git clone https://github.com/strubix/gcv ~/.claude/skills/gcv
cd ~/.claude/skills/gcv && bun install
```

Les scripts trouvent le navigateur tout seuls sur Linux, macOS, Windows et WSL. Sinon :
`export CHROME_PATH=/chemin/vers/chrome`.

Conseillé : installer la police [Inter](https://rsms.me/inter/), sinon la pagination peut se
décaler d'une ligne.

## Utilisation

**1. Première fois** : dans Claude Code, tape

```
/gcv init
```

Claude te demande ton CV actuel ou ton export LinkedIn en PDF (profil LinkedIn, « Plus »,
« Enregistrer au format PDF »), et le dossier où ranger les CV. Il construit ton
**référentiel de faits** (`references/profil-source.md`) puis te pose les questions qui
comblent les trous. Plus il est complet, meilleurs sont les CV.

**2. Pour chaque candidature** : colle l'annonce.

```
/gcv <texte de l'annonce, URL ou fichier>
```

Options : `--lang fr|en`, `--pages 1|2`, `--rounds N` (tours de débat, 2 par défaut),
`--no-debat` (CV rapide sans débat), `--marche fr|ch|remote`.

Autres commandes : `/gcv refresh` (après mise à jour de ton CV source),
`/gcv audit <cv.html> <annonce>` (passer un CV existant au débat).

## Vie privée

Ton référentiel contient tes données personnelles. Il reste sur ta machine et il est ignoré
par git (`.gitignore`). Si tu forkes ou redistribues la skill, vérifie qu'il n'y est pas.

Le gabarit livré contient un profil **fictif** (Camille Martin), là pour montrer le rendu
attendu.

## Licence

MIT
