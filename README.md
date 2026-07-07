# Esport Interface utilisateur - L'Expérience utilisateur

Le dépôt `esport-interface-utilisateur` matérialise l'interface stratégique de Esport Hub.  
Il fournit une expérience et interface utilisateur en temps réel orientée performance, avec une esthétique **Arène sombre** et une communication fluide avec l'Oracle IA.

## Socle technique

| Domaine | Technologie | Usage |
|---|---|---|
| Expérience et interface utilisateur | React 19 | Composition d'interface moderne |
| Langage | TypeScript | Sécurité de typage et maintenabilité |
| Outils de construction | Vite | Serveur de développement rapide et compilation optimisée |
| Habillage visuel | Tailwind CSS | Système de conception utilitaire et cohérent |
| Routage | React Router | Navigation et protection de routes |
| Récupération des données | React Query | Cache, synchronisation et invalidation |
| Formulaires | React Hook Form + Zod | Validation robuste des entrées |
| HTTP | Axios | Communication avec l'API du moteur métier |

## Interface stratégique: Expérience utilisateur Arène sombre

L'interface est conçue pour des usages opérationnels:

- contraste élevé et hiérarchie visuelle claire,
- écrans orientés action (inscription, création de match, supervision),
- retour d'information immédiat sur succès/erreurs,
- expérience fluide sur les parcours critiques métier.

Cette approche vise un produit **Prêt pour la production**: lisible, rapide, robuste et exploitable en contexte réel.

## Gestion du flux IA: Diffusion en flux SSE

Le module Oracle de l'interface utilisateur exploite les **Événements envoyés par le serveur (SSE)** pour afficher la réponse IA de façon progressive (mot à mot / segment par segment):

- perception de latence réduite,
- meilleure continuité conversationnelle,
- interaction naturelle avec un agent orienté action.

La diffusion en flux est gérée dans la couche `shared/api` et consommée par le module `oracle`.

## Architecture orientée fonctionnalités

Le code est structuré par domaine métier:

| Fonctionnalité | Responsabilité |
|---|---|
| `auth` | Inscription, connexion, contexte utilisateur, persistance du jeton |
| `players` | Consultation et création des joueurs |
| `matches` | Consultation et enregistrement des matchs |
| `oracle` | Conversation IA, orchestration de l'interface utilisateur du flux SSE |
| `stats` | Indicateurs clés et agrégats métier |
| `dashboard` | Vue consolidée des opérations |

## Organisation interne des fonctionnalités

- `pages`: écrans routés.
- `components`: briques locales d'expérience et interface utilisateur.
- `hooks`: orchestration de données et mutations.
- `services`: accès API.
- `adapters`: correspondance DTO <-> modèles d'interface.
- `schemas`: validation Zod.
- `types`: contrats TypeScript (`*.types.ts`).

Les éléments transverses résident dans `src/shared` (API cliente, correspondance des erreurs, utilitaires, composants mutualisés).

## Sécurité dès la conception (interface utilisateur)

L'interface utilisateur applique des pratiques de sécurité cohérentes:

- routes protégées par rôle et état d'authentification,
- propagation contrôlée du JWT sur les appels API,
- gestion centralisée des erreurs normalisées du moteur métier,
- architecture modulaire limitant les couplages et les effets de bord.

## Démarrage local

Depuis le répertoire `frontend/`:

```bash
npm install
npm run dev
```

Accès local par défaut: [http://localhost:5173](http://localhost:5173)

## Compilation de production

```bash
npm run build
```

Les artefacts sont générés dans `dist/` et servis en conteneur Nginx en environnement Docker.

## Vérification qualité

```bash
npm run lint
```

## Configuration d'environnement

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | URL de base de l'API du moteur métier (ex: `http://localhost:8080/api`) |

Le fichier `frontend/.env.example` sert de référence pour la configuration.
