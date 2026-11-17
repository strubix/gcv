# Référentiel de faits, <Prénom Nom>

> Modèle. `gcv init` le copie vers `profil-source.md` et le remplit à partir des documents
> du candidat. Ne remplis pas ce fichier-ci.

## Configuration

- **Dossier de travail** : `<chemin absolu>` (CV produits, rapports de débat, fichiers de gaps)
- **Préfixe des fichiers** : `CV-<Prenom>-<Nom>` (donne `CV-Prenom-Nom-<entreprise>-<lang>.pdf`)
- **Documents sources** :
  - `<chemin du CV ou dossier de compétences PDF>`, extrait le `<AAAA-MM-JJ>`
  - `<chemin de l'export LinkedIn PDF>` (facultatif)
  - `<CV HTML déjà validés>` (facultatif)

## Règle de provenance

Chaque fait porte sa provenance : `[DC]` dossier de compétences ou CV source, `[LI]` export
LinkedIn, `[CV]` CV déjà validé, `[CAND, AAAA-MM-JJ]` réponse directe du candidat. Un fait
sans marqueur n'existe pas et ne va pas sur un CV.

## §1 Identité et contact

- §1.1 Prénom Nom
- §1.2 E-mail
- §1.3 Téléphone
- §1.4 LinkedIn, site, GitHub
- §1.5 Ville, région, pays
- §1.6 Mode de travail souhaité (remote, hybride, sur site)
- §1.7 Nationalité ou permis, si utile à un marché (Suisse, UE, visa)
- §1.8 Type de contrat recherché (CDI, freelance, les deux), disponibilité

## §2 Positionnement

- §2.1 Séniorité et années d'expérience
- §2.2 Spécialité principale
- §2.3 Type d'applications ou de domaines
- §2.4 Compétences secondaires

## §3 Expériences

Une sous-section par poste ou mission, de la plus récente à la plus ancienne :

### §3.1 <Entreprise> (client final si ESN), <Intitulé>, <mois année> à <mois année> (<durée>) `[DC]`

- Contexte : produit, secteur, taille d'équipe si connue
- Réalisations : une ligne par fait, sourcée
- Stack : technos réellement utilisées sur cette mission

## §4 Formation

## §5 Stack

Pour chaque techno : sur quelle(s) mission(s) elle a été pratiquée (§3.x). Une techno qui
n'est rattachée à aucune mission va en §9.

## §6 Langues

## §7 Autres compétences (facultatif)

## §8 Chiffres et preuves mobilisables

Uniquement des chiffres sourcés : durées, volumes, tailles d'équipe, gains mesurés. Rien
d'estimé.

## §9 Zones grises, à traiter avec précaution

Ce que le challenger trouvera de toute façon, autant le documenter d'avance : trous ou
chevauchements de dates, technos listées sans mission, absence de métriques, intitulés
ambigus, ce que le candidat n'a **jamais** pratiqué et ne doit jamais apparaître.

- §9.1 ...
