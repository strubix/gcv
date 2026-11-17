---
name: gcv
description: >-
  Génère un CV taillé pour une annonce précise à partir du dossier de compétences du candidat,
  puis le durcit via un débat contradictoire entre un agent qui défend le CV et un agent qui
  incarne le recruteur, l'ATS, le tech lead et les RH. Produit le CV en HTML et PDF, le
  compte-rendu du débat (qui sert de préparation d'entretien) et la liste des exigences non
  couvertes. Déclenche dès que l'utilisateur parle de postuler ou d'adapter son CV : « fais-moi un CV
  pour cette annonce », « adapte mon CV à ce poste », « CV pour <entreprise> », « je postule à
  ça », « prépare ma candidature », « challenge mon CV », « est-ce que mon CV passe pour ce
  poste », « voilà l'offre, tu peux me faire le CV ». Déclenche aussi quand l'utilisateur colle une
  offre d'emploi brute avec une intention de candidature, même sans dire le mot « CV ».
  Ne pas déclencher pour une lettre de motivation seule, ni pour de la préparation d'entretien
  sans production de CV.
argument-hint: 'init   |   <annonce collée | url | fichier>  [--lang fr|en] [--pages 1|2] [--rounds N] [--no-debat] [--marche fr|ch|remote]   |   refresh   |   audit <cv.html> <annonce>'
---

# gcv, CV taillé pour une annonce + débat contradictoire

Tu produis un CV pour **une** annonce, pas un CV générique. La valeur n'est pas dans la mise
en page (le gabarit existe déjà), elle est dans deux choses : la sélection de ce qui répond à
l'annonce, et le passage au feu d'un débat qui simule le vrai parcours du document.

Un CV généré sans contradiction sort systématiquement trop lisse et trop complaisant. Le
débat existe pour corriger ça : un agent défend, un agent attaque avec les yeux des quatre
personnes qui vont réellement lire le CV, et tu arbitres.

## Sous-commandes

| Commande | Effet |
|---|---|
| `gcv init` | première utilisation : construit le référentiel de faits du candidat |
| `gcv <annonce>` | pipeline complet, phases 0 à 4 |
| `gcv --no-debat <annonce>` | v1 seule, pour une base rapide |
| `gcv refresh` | ré-extrait les documents sources vers le référentiel et signale ce qui a changé |
| `gcv audit <cv.html> <annonce>` | saute la génération, lance le débat sur un CV existant |

Options : `--lang fr|en` (défaut : langue de l'annonce), `--pages 1|2`, `--rounds N`
(défaut 2), `--marche fr|ch|remote`.

## Première utilisation, `gcv init`

Si `references/profil-source.md` n'existe pas, **arrête tout et lance `init`**, même si
l'utilisateur a collé une annonce : sans référentiel, il n'y a rien à sélectionner, et un CV
écrit sans source est exactement ce que cette skill existe pour empêcher.

1. Demande les documents sources du candidat : CV actuel (PDF ou autre), export LinkedIn PDF
   (sur LinkedIn : profil, « Plus », « Enregistrer au format PDF »), dossier de compétences,
   anciens CV validés. Un seul suffit pour démarrer, plusieurs donnent un meilleur référentiel.
2. Demande le **dossier de travail** (où ranger CV, débats et gaps) et le **préfixe** des
   fichiers (par défaut `CV-<Prenom>-<Nom>`).
3. Extrais le texte des PDF :
   ```bash
   bun ~/.claude/skills/gcv/scripts/extract-pdf.ts "<fichier.pdf>" --out <dossier de travail>/source.txt
   ```
   Le script ne dépend ni de poppler ni de pdftotext : il marche partout où Bun tourne.
4. Copie [references/profil-source.template.md](references/profil-source.template.md) vers
   `references/profil-source.md` et remplis-le, section par section, **uniquement** avec ce
   que disent les documents. Chaque fait porte son marqueur de provenance.
5. Pose ensuite les questions qui comblent les trous, en une seule salve : dates manquantes,
   technos citées sans mission, chiffres disponibles, ce que le candidat n'a jamais pratiqué
   et qui ne doit jamais apparaître (§9), type de contrat et mobilité (§1). Note chaque
   réponse avec `[CAND, AAAA-MM-JJ]`.
6. Si le candidat a déjà un CV HTML ou un style qu'il aime, garde le gabarit et adapte
   seulement le contenu. Le gabarit livré contient un profil **fictif** (Camille Martin) :
   rien de son contenu ne doit survivre dans un vrai CV.

Le référentiel est privé : il contient des données personnelles. Ne le partage pas avec la
skill si tu la redistribues.

## Sources

1. **Référentiel de faits** : `references/profil-source.md`, construit par `init`.
   C'est la source unique. Tout ce qui va sur le CV vient de là, avec son `§`. Son en-tête
   donne le dossier de travail, le préfixe des fichiers et les documents sources.
2. **Gabarit** : [references/gabarit-cv.html](references/gabarit-cv.html), contenu fictif,
   CSS éprouvé en impression A4.
3. **Règles de rédaction** : [references/regles-redaction.md](references/regles-redaction.md).
   Lis-les avant d'écrire le moindre bullet.
4. **Grille du débat** : [references/grille-debat.md](references/grille-debat.md).
5. **Lexique FR vers EN** : [references/lexique-en.md](references/lexique-en.md), à charger
   dès que le CV part en anglais. Sa partie 2 s'enrichit au fil des CV anglais validés.
6. **Densité et lisibilité** : [references/densite.md](references/densite.md), les seuils
   mesurés et les leviers de correction. À lire la première fois que l'audit signale un point.
7. **CV antérieurs** : les CV HTML déjà produits dans le dossier de travail, utiles pour
   retrouver une formulation qui a déjà convaincu le candidat.

Si un document source listé dans l'en-tête du référentiel est plus récent que le
référentiel, propose `gcv refresh` avant de commencer.

## Prérequis

- **Bun** (`curl -fsSL https://bun.sh/install | bash`), puis `bun install` dans le dossier de
  la skill pour installer `unpdf`, qui lit et vérifie les PDF sans dépendance native
- **Chrome, Chromium ou Edge**, pour la mesure de densité et le rendu PDF. Les scripts le
  cherchent aux emplacements habituels (Linux, macOS, Windows, WSL). Sinon :
  `CHROME_PATH=/chemin/vers/chrome`
- Facultatif mais conseillé : la police **Inter** installée localement. Sans elle, le rendu
  retombe sur une police de substitution et la pagination peut se décaler d'une ligne ou
  deux, ce qui suffit à faire déborder un CV

## Phase 0, décoder l'annonce

Avant d'écrire quoi que ce soit, produis une fiche de brief. Elle sera relue par les deux
agents, donc elle doit tenir seule :

```
Entreprise / poste / contrat / lieu
Langue de l'annonce, donc langue du CV : fr | en
Must-have    : les exigences bloquantes, celles dont l'absence disqualifie
Nice-to-have : le reste, explicitement séparé
Stack imposée : les technos nommées, avec leur orthographe exacte
Séniorité attendue et ce qui la trahit dans le texte
Mots-clés ATS : les termes à faire figurer littéralement
Signaux culturels : taille d'équipe, méthode, autonomie attendue, produit ou prestation
Zones floues : ce que l'annonce ne dit pas et qu'il faudra deviner
```

### La langue, décidée ici et pas ailleurs

**Le CV est écrit dans la langue de l'annonce.** Annonce en anglais, CV en anglais. Annonce en
français, CV en français. C'est la langue du texte qu'on te donne qui commande, pas la
nationalité de l'entreprise ni le pays du poste : une annonce en anglais chez un groupe
français se traite en anglais, parce que le document que le recruteur a sous les yeux est en
anglais et qu'il comparera les deux côte à côte.

Écris la langue retenue en tête de la fiche de brief et n'y reviens plus. La décider tard, ou
la laisser implicite, produit le pire des cas : un CV à moitié traduit.

Trois cas particuliers :
- **Annonce bilingue** (corps français, intitulé et compétences en anglais) : français, avec
  les termes techniques dans l'orthographe exacte de l'annonce
- **`--lang` explicite** : il gagne toujours sur la détection, sans discussion
- **Doute réel** (annonce très courte, offre relayée par un intermédiaire) : demande au candidat
  plutôt que de deviner, c'est une question à cinq secondes

Si le CV part en anglais, charge [references/lexique-en.md](references/lexique-en.md) avant
d'écrire. Le référentiel de faits est en français : sans le lexique, tu retraduis les
intitulés de poste et les phrases de contexte à ta façon, et deux CV envoyés à deux
entreprises anglophones ne racontent plus la même carrière. Les formulations du lexique sont
déjà validées, elles ont l'avantage d'exister.

Le paragraphe de profil fait exception : il se réécrit en anglais, il ne se traduit pas. Une
traduction littérale du profil français s'entend immédiatement, et c'est le premier paragraphe
que le recruteur lit.

La séparation must-have / nice-to-have est l'arbitrage le plus structurant du CV. Une annonce
liste souvent quinze technos dont trois comptent vraiment. Traiter les quinze à égalité
produit un CV plat qui répond à tout et ne convainc de rien.

Si l'annonce est trop maigre pour trancher (poste flou, stack absente, séniorité indevinable),
pose les questions maintenant. Une question à ce stade coûte trente secondes au candidat, la même
question après trois phases coûte tout le travail.

## Phase 1, le CV v1

Copie le gabarit vers `<dossier de travail>/<préfixe>-<entreprise>-<lang>.html` (les deux
valeurs sont dans l'en-tête du référentiel), puis construis le contenu.

Ordre de travail, parce qu'il évite de repeindre plusieurs fois : d'abord la sélection des
missions à mettre en avant, ensuite le bloc de compétences, ensuite les bullets, et le résumé
de tête en dernier (il synthétise le reste, l'écrire en premier revient à le réécrire).

**Traçabilité.** Pendant tout le travail, chaque bullet porte sa source en commentaire HTML :

```html
<li>Migration du back-office de Vue 2 vers Vue 3<!-- src: §3.1 --></li>
```

Ce n'est pas de la bureaucratie. C'est ce qui rend l'invention mécaniquement détectable : un
bullet sans `src` est soit à sourcer, soit à supprimer. Le vrai risque d'un CV généré n'est
pas d'être mal écrit, c'est d'affirmer une chose que le candidat devra défendre en entretien sans
l'avoir vécue. Les commentaires sont retirés juste avant le rendu final.

**Le gras se compte en mots, pas en passages.** Vise au plus 12% des mots du profil et 15%
du premier bloc. Un surlignage utile fait deux ou trois mots et sert de repère à qui saute le
reste de la phrase ; une proposition entière en gras ne met plus rien en valeur. C'est
l'erreur la plus facile à commettre en resserrant un texte, parce qu'elle se produit alors
même qu'on réduit le nombre de surlignages.

## Phase 2, le débat

Lance les deux agents **dans le même message** pour qu'ils travaillent en parallèle, avec
`subagent_type: general-purpose` et un `name` pour pouvoir les relancer via `SendMessage`.

Donne-leur les chemins, pas le contenu recopié : ils liront eux-mêmes, et ils pourront relire
au tour suivant.

### Agent `avocat-cv`

```
Tu es l'avocat du CV. Ton client est le document, pas le candidat.

À lire : <chemin CV v1>, <chemin fiche de brief>,
~/.claude/skills/gcv/references/profil-source.md,
~/.claude/skills/gcv/references/grille-debat.md

Ta tâche, en deux temps.

1. Défense structurée : pour chaque section du CV, dis pourquoi elle mérite sa place et son
   rang par rapport à l'annonce. Sois précis, pas laudatif.

2. Renforcements : identifie ce que le CV sous-exploite. Le référentiel contient plus de
   matière que ce qui tient sur deux pages, et une partie a peut-être été écartée à tort.
   Chaque renforcement proposé doit citer son § de source.

Règle absolue : tu n'as pas le droit d'inventer une expérience, une techno ou un chiffre pour
gagner un point. Si tu ne peux pas sourcer, tu ne proposes pas. Ton rôle n'est pas de gonfler
le CV, c'est de vérifier qu'il exploite tout ce qui est réellement disponible.

Réponds au format de la grille (axes A1 à A7).
```

### Agent `challenger-brief`

```
Tu es l'adversaire du CV. Tu portes quatre chapeaux successifs et tu signes chaque critique
du chapeau utilisé.

À lire : <chemin CV v1>, <chemin fiche de brief>,
~/.claude/skills/gcv/references/profil-source.md,
~/.claude/skills/gcv/references/grille-debat.md

Chapeau 1, recruteur 30 secondes : tu as 40 CV à trier. Que retiens-tu du tiers supérieur de
la page 1 ? Qu'est-ce qui te fait passer au suivant sans lire la suite ?

Chapeau 2, filtre ATS : quels termes exacts de l'annonce n'apparaissent pas dans le document ?
Quels éléments de mise en forme cassent le parsing ?

Chapeau 3, tech lead qui fera l'entretien technique : quelle affirmation vas-tu attaquer en
premier ? Sur laquelle le CV promet plus que ce que le référentiel peut soutenir ? Formule
les questions que tu poserais.

Chapeau 4, RH ou acheteur : cohérence du parcours, trous, chevauchements de dates, séniorité
gonflée, adéquation au niveau de rémunération ou de TJM visé.

Puis, séparément : challenge l'annonce elle-même. Exigences irréalistes ou contradictoires,
stack incohérente avec le besoin décrit, signaux d'une mission mal cadrée ou d'une équipe en
difficulté, ce que l'annonce ne dit pas et qui devrait inquiéter.

Une critique sans axe, sans section visée et sans conséquence n'est pas recevable. Vise la
précision, pas le volume : dix critiques molles valent moins que quatre qui portent.
```

### Le déroulé

Un tour = attaque du challenger, réponse de l'avocat sur chaque point, relance du challenger
sur ce qui reste ouvert. Tu relaies via `SendMessage` pour que chacun garde son contexte.

`--rounds` fixe le maximum (défaut 2). Arrête-toi avant si plus aucun point n'est ouvert : un
tour qui reformule le précédent ne produit rien.

Si le challenger sort plus de dix points au premier tour, ne rustine pas. C'est le signe que
la phase 1 a été menée sans lire l'annonce assez sérieusement, reprends-la.

### L'arbitrage

Tu tranches, jamais les agents. Trois issues, détaillées dans la grille : **accepté** (et
appliqué, à condition d'être traçable à un `§`), **rejeté** (avec le motif écrit), **gap réel**
(l'annonce demande ce que le référentiel ne couvre pas).

Le biais à surveiller : le réflexe est d'accepter les critiques du challenger parce qu'elles
sonnent exigeantes. Beaucoup ne le méritent pas, soit parce qu'elles portent sur une exigence
que l'annonce n'a pas formulée, soit parce que les satisfaire demanderait d'affirmer un fait
absent du référentiel. Un rejet argumenté vaut mieux qu'une concession qui fragilise le candidat en
entretien.

## Phase 3, les livrables

Écris dans le dossier de travail :

| Fichier | Contenu |
|---|---|
| `<préfixe>-<entreprise>-<lang>.pdf` | **le livrable**, c'est ce que le candidat envoie |
| `<préfixe>-<entreprise>-<lang>.html` | la source, gardée pour les retouches |
| `debat-<entreprise>.md` | points attaqués, réponses, arbitrages avec motifs |
| `gaps-<entreprise>.md` | exigences non couvertes, formulation honnête retenue, ce qu'il faudrait aller chercher |

Le rapport de débat n'est pas un journal de travail, c'est une fiche de préparation
d'entretien : il liste par avance les questions qui vont tomber et les réponses que le CV
prépare. Écris-le pour être relu la veille de l'entretien, pas pour justifier ton travail.

Le fichier de gaps est le plus utile des deux. Ce que le candidat ne peut pas prouver est l'info
qui disparaîtrait sinon, et c'est celle qui lui dit s'il doit postuler, se former, ou passer.

## Phase 4, le PDF

**Le livrable est le PDF.** C'est le fichier que le candidat envoie, c'est celui qui doit exister à
la fin. Le HTML reste dans le dossier comme source de retouche, mais un pipeline qui s'arrête
au HTML n'a pas terminé son travail.

Deux commandes, dans cet ordre. La première mesure la page rendue, la seconde produit le PDF.

```bash
bun ~/.claude/skills/gcv/scripts/audit-densite.ts <fichier.html> --pages <1 ou 2>
bun ~/.claude/skills/gcv/scripts/render-pdf.ts   <fichier.html> --pages <1 ou 2>
```

Passe toujours `--pages` avec le nombre de pages voulu. Le rendu vérifie le PDF qu'il vient de
produire et te dira s'il déborde.

### L'audit de densité

Le HTML ne dit rien de l'endroit où l'encre tombe. L'audit instrumente la page rendue et
contrôle neuf points : débordement, marge basse, vide de sidebar, longueur de ligne,
interligne, replis de lignes compactes, part de gras dans le profil et dans le premier bloc,
nombre de chips. Les seuils et leur origine sont dans
[references/densite.md](references/densite.md).

Relance-le après chaque correction : les métriques interagissent, et corriger un point en
dégrade parfois un autre. Corrige dans cet ordre, du moins coûteux au plus coûteux :
récupérer sans rien couper (replis, vide de sidebar, blocs dupliqués), puis couper le
déclaratif, puis redistribuer le blanc récupéré vers l'interligne et les marges.

Ne réduis jamais le corps de texte, l'interligne ou les marges de page pour faire tenir le
CV. Ces trois gestes se voient immédiatement et sont la cause du problème, pas sa solution.

### Pourquoi le script vérifie au lieu de faire confiance

Chrome sort avec un code 0 même quand il a rendu sa propre page d'erreur au lieu du document.
Un `--print-to-pdf` peut donc produire un PDF de 24 Ko contenant « This site can't be reached »
en annonçant un succès. Le script rouvre donc le PDF, en extrait le texte, rejette les pages
d'erreur et les documents quasi vides, et compte les pages.

Il essaie chaque navigateur trouvé, dans l'ordre, et passe au suivant si le PDF produit n'est
pas valide. Si la police `Inter` n'est pas installée, la pagination peut se décaler.

### Le débordement d'une ligne

C'est le défaut le plus fréquent et il ne se voit pas dans le HTML. Il faut s'attendre à devoir gagner
quelques lignes à chaque génération, ce n'est pas un accident.

Quand le script signale un écart, corrige par le contenu et jamais par le CSS, qui est
calibré. Par ordre de dégât croissant : passer une mission ancienne en ligne `.compact`,
retirer un bullet secondaire de la mission la moins pertinente, raccourcir le profil d'une
ligne. Réduire la taille de police est le mauvais réflexe, ça se voit immédiatement.

Un CV sur deux pages est acceptable si la deuxième est pleine. Une deuxième page qui ne porte
que trois lignes de formation donne l'impression d'un document mal fini, et c'est précisément
ce que le contrôle détecte.

## Garde-fous

**Zéro invention.** Aucune techno, aucun chiffre, aucun client, aucune date qui ne soit au
référentiel. Face à un gap, propose une formulation honnête de compétence transférable, jamais
une affirmation fausse, et consigne-le. Un CV qui décroche un entretien sur une affirmation
fausse a coûté du temps à tout le monde.

**Pas de gonflage de séniorité ni de durées.** Les zones grises connues sont listées en §9 du
référentiel : chevauchements de dates, absence de métriques, techno pratiquée sur une seule
mission, technos présentes en liste de compétences mais rattachées à aucune mission. Le
challenger les trouvera, autant les traiter d'emblée.

**Signale les red flags de l'annonce.** Si le challenger en remonte, dis-le en clair
dans ta réponse finale. Un CV parfait pour une mission pourrie reste une mauvaise affaire.

**Pas de tiret cadratin ni demi-cadratin**, nulle part : CV, rapports, réponse de fin. Virgule,
deux-points, parenthèse, ou phrase coupée en deux. Si tu reprends une formulation d'un ancien
CV, vérifie qu'elle n'en contient pas.

**Une seule langue dans le document.** Avant le rendu, relis le CV entier en cherchant les
résidus de l'autre langue : un libellé de section oublié, un mois abrégé à la française dans
un CV anglais, un `Stack :` avec l'espace insécable français. Ces résidus sont la signature
d'un CV traduit à la va-vite, et ils sautent aux yeux du lecteur natif.

## Réponse finale

Cinq lignes, pas plus : le lien vers le **PDF** en premier, puis les trois autres fichiers,
les deux ou trois arbitrages qui ont réellement changé le CV, et les gaps qui méritent une
décision de sa part. Précise le nombre de pages du PDF produit, c'est la première chose qui
sera vérifiée.
