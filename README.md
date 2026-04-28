# Esport Frontend - L'Expérience Utilisateur

Le dépôt `esport-frontend` matérialise l'interface stratégique de Esport Hub.  
Il fournit une UX temps réel orientée performance, avec une esthétique **Dark Arena** et une communication fluide avec l'Oracle IA.

## Stack technique

| Domaine | Technologie | Usage |
|---|---|---|
| UI | React 19 | Composition d'interface moderne |
| Langage | TypeScript | Sécurité de typage et maintenabilité |
| Build tooling | Vite | Dev server rapide et build optimisé |
| Styling | Tailwind CSS | Design system utilitaire et cohérent |
| Routing | React Router | Navigation et protection de routes |
| Data fetching | React Query | Cache, synchronisation et invalidation |
| Formulaires | React Hook Form + Zod | Validation robuste des entrées |
| HTTP | Axios | Communication API backend |

## Interface stratégique: UX Dark Arena

L'interface est conçue pour des usages opérationnels:

- contraste élevé et hiérarchie visuelle claire,
- écrans orientés action (inscription, création de match, supervision),
- feedback immédiat sur succès/erreurs,
- expérience fluide sur les parcours critiques métier.

Cette approche vise un produit **Production-Ready**: lisible, rapide, robuste et exploitable en contexte réel.

## Gestion du flux IA: Streaming SSE

Le module Oracle frontend exploite les **Server-Sent Events (SSE)** pour afficher la réponse IA de façon progressive (mot à mot / segment par segment):

- perception de latence réduite,
- meilleure continuité conversationnelle,
- interaction naturelle avec un agent orienté action.

Le streaming est géré dans la couche `shared/api` et consommé par la feature `oracle`.

## Architecture Feature-First

Le code est structuré par domaine métier:

| Feature | Responsabilité |
|---|---|
| `auth` | Inscription, connexion, contexte utilisateur, persistance token |
| `players` | Consultation et création des joueurs |
| `matches` | Consultation et enregistrement des matchs |
| `oracle` | Chat IA, orchestration UI du flux SSE |
| `stats` | KPIs et agrégats métier |
| `dashboard` | Vue consolidée des opérations |

## Organisation interne des features

- `pages`: écrans routés.
- `components`: briques UI locales.
- `hooks`: orchestration de données et mutations.
- `services`: accès API.
- `adapters`: mapping DTO <-> modèles UI.
- `schemas`: validation Zod.
- `types`: contrats TypeScript (`*.types.ts`).

Les éléments transverses résident dans `src/shared` (API client, mapping erreurs, utilitaires, composants mutualisés).

## Secure by Design (frontend)

Le frontend applique des pratiques de sécurité cohérentes:

- routes protégées par rôle et état d'authentification,
- propagation contrôlée du JWT sur les appels API,
- gestion centralisée des erreurs backend normalisées,
- architecture modulaire limitant les couplages et les effets de bord.

## Démarrage local

Depuis `frontend/`:

```bash
npm install
npm run dev
```

Accès local par défaut: [http://localhost:5173](http://localhost:5173)

## Build de production

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
| `VITE_API_BASE_URL` | URL de base de l'API backend (ex: `http://localhost:8080/api`) |

Le fichier `frontend/.env.example` sert de référence pour la configuration.
