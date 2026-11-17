# Grille du débat contradictoire

Les deux agents travaillent sur cette grille commune. Elle sert à trois choses : donner un
langage partagé pour que les critiques soient comparables, empêcher le débat de tourner à
l'échange d'impressions, et permettre à l'arbitre de trancher sur des critères stables.

## Les sept axes

| # | Axe | Question à laquelle il répond |
|---|---|---|
| A1 | Couverture des must-have | Chaque exigence bloquante de l'annonce trouve-t-elle une réponse visible ? |
| A2 | Preuve | Les affirmations sont-elles adossées à un fait daté et situé, ou flottent-elles ? |
| A3 | Passage ATS | Les termes exacts de l'annonce apparaissent-ils, et le document est-il parsable ? |
| A4 | Lisibilité 30 secondes | Le tiers supérieur de la page 1 suffit-il à conclure « à voir » ? |
| A5 | Crédibilité de la séniorité | Le niveau revendiqué tient-il face au détail des missions ? |
| A6 | Absence de gonflage | Y a-t-il une affirmation que le candidat ne pourrait pas défendre 5 minutes en entretien ? |
| A7 | Adéquation au contexte | Format, langue, longueur, codes du marché et du type de contrat visé |
| A8 | Densité et lisibilité | La page rendue est-elle lisible, ou saturée au point que les preuves se noient ? |

A8 ne se débat pas, il se mesure : `bun scripts/audit-densite.ts <fichier.html>` tranche en
une commande. Les deux agents peuvent citer son résultat, aucun ne peut le contredire par
l'argumentation. C'est volontaire : sur la mise en page, une mesure vaut mieux qu'une opinion,
et l'expérience montre que la densité est un angle mort du débat sur le fond. Un CV
irréprochable sur A1 à A7 peut rester illisible.

Sur A6, la règle est asymétrique : un CV un peu trop modeste coûte un entretien, un CV gonflé
coûte la crédibilité. En cas de doute, la modestie gagne.

## Format d'une critique

Chaque point soulevé par le challenger prend cette forme, sinon il n'est pas recevable :

```
[A3] [chapeau: filtre ATS] Section "Compétences"
Problème : l'annonce exige "Nuxt" trois fois, le mot n'apparaît nulle part dans le CV.
Conséquence : filtrage automatique probable avant lecture humaine.
Attendu : que le CV traite explicitement la question Nuxt, ou assume l'écart.
```

Un « c'est un peu faible » sans axe, sans section et sans conséquence n'est pas une critique,
c'est une humeur. Ignore-la.

## Format d'une réponse

L'avocat répond point par point, dans l'un de ces trois registres :

- **Défense** : le point est déjà couvert, voici où et pourquoi c'est suffisant
- **Concession avec contre-proposition** : le point est juste, voici la réécriture, sourcée
  au référentiel (`§x.y`)
- **Objection de fond** : la critique repose sur une exigence que l'annonce n'a pas formulée,
  ou demanderait d'affirmer un fait absent du référentiel

Le troisième registre est le plus important. L'avocat n'a pas le droit d'inventer une
expérience pour gagner un point, et sa vraie valeur est de refuser les critiques qui
pousseraient au mensonge.

## Arbitrage

L'arbitre est l'orchestrateur, jamais les agents. Trois issues possibles par point :

- **Accepté** : la modification est appliquée. Condition non négociable : elle est traçable
  à un `§` du référentiel.
- **Rejeté** : avec le motif écrit dans le rapport. Un rejet documenté a de la valeur, il
  évite de rouvrir le même débat au prochain CV.
- **Gap réel** : l'annonce demande une chose que le référentiel ne couvre pas. Ni accepté ni
  rejeté : consigné dans le fichier de gaps, avec la formulation honnête retenue en attendant.

## Convergence

Le débat s'arrête quand plus aucun point ouvert ne reste, même si le nombre de tours prévus
n'est pas atteint. Un troisième tour qui reformule le premier ne produit rien : mieux vaut
livrer et laisser le candidat arbitrer sur pièce.

Signal d'alerte inverse : si le challenger produit plus de dix points sur le premier tour,
c'est en général que le CV v1 a été construit sans lire l'annonce assez sérieusement. Dans ce
cas, reprends la phase 1 plutôt que de rustiner point par point.
