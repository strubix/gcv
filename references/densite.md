# Densité et lisibilité

Un CV peut être juste sur le fond et illisible en pratique. Le HTML ne dit rien de l'endroit
où l'encre tombe réellement : il faut mesurer la page rendue.

`scripts/audit-densite.ts` fait cette mesure et compare à des seuils. Ce fichier explique
d'où ils viennent et comment corriger ce qui dépasse.

## D'où viennent ces seuils

Ils ont été établis en mesurant des CV réels, en particulier en comparant une version
compressée d'un CV à une version aérée du même gabarit.
La version compressée faisait tenir 21% de texte en plus sur la même surface. Elle passait,
mais un lecteur la trouvait « trop condensée » sans pouvoir dire pourquoi.

La mesure a donné la réponse, et elle est contre-intuitive : **le blanc n'avait pas diminué**.
Il y en avait autant que sur la version aérée, 30,6% de la hauteur utile contre 29,9%. Ce qui
avait changé, c'est sa répartition. La version aérée logeait deux tiers de son blanc dans des
respirations d'au moins 12 px. La version compressée n'en logeait que 40%, le reste dispersé
en miettes de 2 à 9 px.

> Un blanc réparti uniformément n'est pas perçu comme du blanc, il est perçu comme du gris.

C'est la clé à retenir : la densité ressentie ne vient pas d'un manque d'espace, elle vient
d'une absence de hiérarchie dans l'espace. Et c'est une bonne nouvelle, parce que le
correctif ne demande presque jamais de supprimer du contenu.

## Les contrôles

| Contrôle | Seuil | Pourquoi |
|---|---|---|
| Débordement hors A4 | aucun | mesuré contre la feuille visée, `--pages 2` déplace la référence |
| Marge basse, colonne principale | ≥ 20 px | en dessous, le texte touche le bord physique de la feuille |
| Vide inutilisé en sidebar | 0 à 30 px | négatif elle déborde, au-delà c'est du blanc perdu dans la mauvaise colonne |
| Caractères par ligne | ≤ 90 | plage de lecture confortable 45 à 75, 90 est le plafond praticien |
| Interligne du corps | ≥ 1,45 | en dessous, une ligne longue devient pénible : l'œil rate la suivante au retour |
| Lignes compactes qui se replient | 0 | quelques caractères de trop coûtent 15 px chacun |
| Gras dans le profil | ≤ 12% | au-delà, le gras ne filtre plus rien |
| Gras dans le premier bloc | ≤ 15% | idem, sur le bloc le plus lu |
| Nombre de chips | ≤ 26 | au-delà, la liste se lit comme une texture, pas comme des mots |

## Le piège du gras

Ce n'est pas le **nombre** de passages en gras qui compte, c'est la **part des mots**
concernés. Réduire sept surlignages à trois tout en allongeant chacun aggrave la situation :
c'est exactement l'erreur commise sur un CV corrigé lors de la mise au point, où le ratio est passé de 19% à
25% alors que le nombre de surlignages avait diminué de moitié.

Un surlignage utile est un repère de deux ou trois mots, pas une proposition entière. Mets en
gras ce qu'un recruteur doit pouvoir lire en sautant le reste de la phrase.

## Les deux asymétries à surveiller

**Les colonnes sont indépendantes.** La sidebar et la colonne principale sont deux cellules
d'une grille CSS : comprimer la sidebar ne libère pas un pixel dans la colonne principale.
C'est l'erreur la plus coûteuse, parce qu'elle dégrade la lisibilité sans rien rapporter.
Quand la sidebar a du vide et que la principale sature, le vide n'est dépensable que sur
place, en aération de la sidebar.

**Un repli coûte cher pour rien.** Une ligne compacte qui déborde de quatre caractères
consomme une ligne entière. Trois replis ont coûté 12,2 mm sur un CV mesuré, soit largement de
quoi aérer toute la section expérience. Raccourcir la liste de technos de la ligne fautive est
le meilleur rapport gain sur effort de tout le document.

## Corriger, dans cet ordre

1. **Récupérer sans rien couper** : replis de lignes compactes, vide de sidebar, blocs
   dupliqués (un chapeau freelance qui répète le premier intitulé de poste, par exemple)
2. **Couper le déclaratif** : les phrases qui affirment une qualité sans la prouver, les
   atouts qui répètent le paragraphe de profil, les chips rattachées à aucune mission
3. **Redistribuer** : rendre le blanc récupéré à l'interligne, aux marges de section, à la
   marge basse

Ce qu'il ne faut pas faire, dans l'ordre inverse de la tentation : réduire le corps de texte,
réduire l'interligne, réduire les marges de la page. Ces trois gestes se voient immédiatement
et sont la cause du problème, pas sa solution.

## Vérifier

```bash
bun ~/.claude/skills/gcv/scripts/audit-densite.ts <fichier.html> [--pages N]
```

À lancer avant le rendu PDF, et à relancer après chaque correction : les métriques
interagissent, et corriger un point en dégrade parfois un autre.
