# Règles de rédaction du CV

## Le lecteur réel

Un recruteur passe 30 à 40 secondes sur un CV au premier tri. Il ne lit pas, il cherche des
correspondances avec l'annonce qu'il a sous les yeux. Tout ce que tu écris doit être conçu
pour ce parcours-là : le tiers supérieur de la première page décide, le reste confirme.

Le corollaire pratique : la hiérarchie du CV se réorganise à chaque annonce. Ce n'est pas la
chronologie qui commande, c'est ce que l'annonce demande.

## Le bullet qui tient

Structure : **action + objet + contexte technique + effet**. L'effet est ce qui distingue un
CV de développeur d'une liste de tâches.

Faible : « Développement de fonctionnalités et résolution de bugs »
Correct : « Migration du back-office de Vue 2 vers Vue 3 et TypeScript, sans gel des
livraisons, pour un éditeur SaaS logistique »

Le second dit la même chose mais donne au lecteur trois accroches : la techno, la contrainte,
le contexte métier. Un bullet sans accroche est un bullet mort.

Contraintes :
- 4 bullets maximum par mission récente, 2 pour les anciennes, 0 pour celles qui ne servent
  pas l'annonce (une ligne compacte suffit)
- Une ligne et demie maximum par bullet, sinon il ne sera pas lu
- Verbes à l'infinitif ou au participe, jamais de « j'ai »
- Pas de point final sur les bullets

## Les chiffres

Un chiffre vaut dix adjectifs, mais un chiffre inventé coûte la candidature quand il est
testé en entretien. Si le référentiel `profil-source.md` ne contient pas de métrique de
performance (sa section §9 le signale), ce n'est pas à toi de combler ce trou.

Ce que tu peux chiffrer sans risque : durées, versions, nombre de missions, taille des équipes
si documentée, périmètre fonctionnel. Ce que tu ne chiffres jamais sans source : gains de
performance, couverture de tests, volumétrie utilisateurs, économies réalisées.

Si l'annonce insiste sur les résultats mesurables, écris-le dans le fichier de gaps et
demande les chiffres au candidat. C'est une question à trente secondes pour lui, et c'est la
différence entre un CV solide et un CV qui s'effondre au premier entretien.

## Les mots-clés

Les filtres automatiques (ATS) et les recruteurs qui font Ctrl+F cherchent les termes exacts
de l'annonce. Si l'annonce dit « Vue.js », écris « Vue.js » même si « Vue 3 » est plus précis,
ou écris les deux. Si elle dit « CI/CD », n'écris pas seulement « GitHub Actions ».

La contrainte inverse : un bloc de compétences qui liste tout ne signale rien. Sélectionne.
Une liste de compétences doit être lisible comme une réponse à l'annonce, pas comme un
inventaire. Ce que l'annonce ne demande pas et que le candidat ne veut pas refaire, coupe-le.

## Ce qui sonne faux

Les formules qui affaiblissent un CV senior parce qu'elles ne coûtent rien à écrire :
« passionné », « rigoureux », « esprit d'équipe », « force de proposition » posé sans preuve,
« maîtrise parfaite », « expert en » sur une techno vue une fois.

Le remplacement n'est pas un autre adjectif, c'est un fait. « Force de proposition » devient
« audit technique de l'existant et proposition d'un plan de migration progressif », qui dit la
même chose en étant vérifiable.

## Le résumé de tête

Trois à cinq lignes, réécrites intégralement pour chaque annonce. C'est le seul endroit du CV
où tu t'adresses directement à l'entreprise. Il doit contenir : la séniorité, la spécialité
qui correspond à l'annonce, le type d'application que le candidat construit, et ce qu'il cherche.

Ne recopie jamais le résumé d'un CV précédent sans le retravailler : c'est le premier endroit
où un recruteur sent le CV générique.

## Longueur et pagination

Une page est un objectif, pas un dogme. Au-delà d'une dizaine de missions ou de 8 ans de métier, deux pages sont
légitimes à condition que la première soit auto-suffisante : si le recruteur s'arrête à la
fin de la page 1, il doit déjà avoir la réponse.

Les missions anciennes ou hors sujet passent en lignes compactes (une ligne : rôle, société,
techno, année). Le gabarit prévoit une classe `.compact` pour ça. Surveille leur longueur :
quelques caractères de trop font replier la ligne et coûtent 15 px, ce qui annule tout le
bénéfice du format compact.

La lisibilité de la page rendue se mesure, elle ne s'estime pas : `densite.md` donne les
seuils et `scripts/audit-densite.ts` les contrôle.

## Ton et langue

Langue du CV = langue de l'annonce, décidée en phase 0 et jamais rediscutée ensuite. Une
annonce en anglais dans une entreprise française se traite en anglais. Pour un CV anglais,
`lexique-en.md` donne les formulations déjà validées : les intitulés de poste, les phrases de
contexte des missions et les libellés de sections en sortent, pas d'une traduction improvisée.

Pas de tiret cadratin ni de tiret demi-cadratin, ni dans le CV ni dans les rapports : beaucoup
de lecteurs y voient le marqueur le plus visible d'un texte écrit par une IA. Utilise
la virgule, les deux-points, la parenthèse, ou coupe la phrase.

## Marchés

- **France** : photo tolérée mais optionnelle, coordonnées complètes, formation en bas
- **Suisse romande** : si le candidat a la nationalité suisse ou un permis, le mentionner,
  c'est un avantage décisif face à un profil frontalier sans permis, et préciser la
  disponibilité géographique
- **Remote international / annonce en anglais** : pas de photo, pas d'âge, pas d'adresse
  précise, formation résumée, mise en avant de l'autonomie et du travail asynchrone
