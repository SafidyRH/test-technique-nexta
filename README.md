# 🚀 NextA Crowdfunding Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

**Plateforme de financement participatif pour projets innovants des TPME malgaches**

Développée dans le cadre du test technique Lead Developer NextA - MVP livré en 3 jours-homme.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du Projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Base de Données](#-base-de-données)
- [Choix Techniques](#-choix-techniques)
- [Tests](#-tests)
- [Déploiement](#-déploiement)

---

## ✨ Fonctionnalités

### Gestion des Projets
- ✅ **Création de projet** : Titre, description, objectif de financement, image
- ✅ **Affichage des projets** : Liste avec statistiques temps réel
- ✅ **Détail du projet** : Vue complète avec progression et contributions
- ✅ **Filtres & Tri** : Par statut, montant, progression, date
- ✅ **Recherche** : Recherche textuelle dans titres et descriptions

### Contributions
- ✅ **Contribution rapide** : Montants prédéfinis ou personnalisés
- ✅ **Identification contributeur** : Nom, email optionnel, message
- ✅ **Liste des contributeurs** : Affichage avec statistiques
- ✅ **Top contributeurs** : Podium des plus grands donateurs

### Statistiques & Analytics
- ✅ **Progression en temps réel** : Calcul dynamique du % d'atteinte
- ✅ **Statistiques globales** : Projets totaux, contributions, financements
- ✅ **Métriques par projet** : Total collecté, nombre de contributeurs

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript 5.3
- **Styling** : Tailwind CSS v4 + shadcn/ui
- **State Management** : React Server Components + Client Components
- **Forms** : React Hook Form (implicite)
- **Validation** : Zod

### Backend
- **BaaS** : Supabase (PostgreSQL + Auto-generated APIs)
- **ORM** : Supabase Client (@supabase/ssr)
- **API** : Next.js API Routes (App Router)
- **Database** : PostgreSQL 15

### DevOps & Tooling
- **Package Manager** : npm
- **Linting** : ESLint
- **Type Checking** : TypeScript
- **Version Control** : Git + GitHub

---

## 🏗️ Architecture

### Architecture Pattern : FSD (Feature-Sliced Design)

```
src/
├── app/                    # Next.js App Router (Pages & API Routes)
├── entities/               # Entités métier (project, contribution)
│   ├── project/
│   │   ├── model/         # Repository & Service
│   │   
│   └── contribution/
├── features/              # Fonctionnalités utilisateur
│   ├── create-project/
│   ├── contribute/
│   └── project-list/
├── widgets/               # Layout components (Header, Footer)
├── shared/                # Code partagé
│   ├── api/              # Supabase clients
│   ├── lib/              # Utils & validations
│   ├── types/            # TypeScript types
│   └── config/           # Constants
└── components/ui/         # shadcn/ui components
```

### Architecture Layers

1. **App Layer** (Next.js) : Routing, pages, API routes
2. **Feature Layer** : Fonctionnalités métier composables
3. **Entity Layer** : Entités avec logique + composants UI
4. **Shared Layer** : Code réutilisable (utils, types, config)

### Data Flow

```
Client Request
    ↓
Next.js Page/API Route (app/)
    ↓
Service Layer (entities/*/model/*.service.ts)
    ↓
Repository Layer (entities/*/model/*.repository.ts)
    ↓
Supabase Client
    ↓
PostgreSQL Database
```

---

## 🚀 Installation

### Prérequis

- Node.js >= 18.17.0
- npm >= 9.0.0
- Compte Supabase (gratuit)

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/nexta-crowdfunding.git
cd nexta-crowdfunding
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

#### Option A : Supabase Cloud (Recommandé)

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier les clés API depuis Settings > API
3. Exécuter les migrations SQL (voir section Base de Données)

#### Option B : Supabase Local

```bash
# Installer Supabase CLI
npm install -g supabase

# Initialiser Supabase
supabase init

# Démarrer Supabase localement
supabase start

# Les credentials seront affichés dans le terminal
```

### 4. Configuration des variables d'environnement

```bash
cp .env.local.example .env.local
```

Éditer `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Initialiser la base de données

Se rendre sur le SQL Editor de Supabase et exécuter :

```bash
# Copier le contenu de supabase/migrations/20241024000000_initial_schema.sql
```

### 6. (Optionnel) Seed data

```bash
# Copier le contenu de supabase/seed.sql dans le SQL Editor
```

### 7. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase | `eyJhbGc...` |
| `NEXT_PUBLIC_APP_URL` | URL de l'application | `http://localhost:3000` |

### Constantes configurables

Voir `src/shared/config/constants.ts` pour :
- Limites de pagination
- Règles de validation
- Format de devise

---

## 💻 Utilisation

### Créer un projet

1. Aller sur `/projects/new`
2. Remplir le formulaire :
   - Titre (min 5 caractères)
   - Description (min 20 caractères)
   - Objectif de financement (min 1 000 Ar)
   - URL image (optionnel)
3. Cliquer sur "Créer le projet"

### Contribuer à un projet

1. Accéder au détail d'un projet (`/projects/:id`)
2. Dans la sidebar, sélectionner un montant ou entrer un montant personnalisé
3. Renseigner nom et email (optionnel)
4. Ajouter un message de soutien (optionnel)
5. Cliquer sur "Contribuer"

### Filtrer les projets

Sur `/projects` :
- **Recherche** : Par titre ou description
- **Statut** : Actif, Terminé, Annulé
- **Tri** : Date, progression, montant

---

## 📁 Structure du Projet

```
nexta-crowdfunding/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                # Layout global
│   │   ├── page.tsx                  # Page d'accueil
│   │   ├── projects/
│   │   │   ├── page.tsx              # Liste projets
│   │   │   ├── [id]/page.tsx         # Détail projet
│   │   │   └── new/page.tsx          # Création projet
│   │   └── api/
│   │       ├── projects/route.ts     # API CRUD projets
│   │       └── contributions/route.ts # API contributions
│   │
│   ├── entities/                      # Entités métier
│   │   ├── project/
│   │   │   ├── model/
│   │   │   │   ├── project.repository.ts
│   │   │   │   └── project.service.ts
│   │   │   
│   │   └── contribution/
│   │       ├── model/
│   │       
│   │
│   ├── features/                      # Features
│   │   ├── create-project/
│   │   ├── contribute/
│   │   └── project-list/
│   │
│   ├── shared/                        # Code partagé
│   │   ├── api/
│   │   │   ├── supabase-client.ts
│   │   │   └── supabase-server.ts
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   └── validations.ts
│   │   ├── types/
│   │   └── config/
│   │
│   └── components/ui/                 # shadcn/ui
│
├── supabase/
│   ├── migrations/                    # SQL migrations
│   └── seed.sql                       # Données de test
│
├── docs/                              # Documentation
│   ├── architecture.md
│   └── database-schema.md
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 📡 API Documentation

### Projects

#### `GET /api/projects`

Récupère la liste des projets avec filtres.

**Query Parameters:**
- `status` (optional): `active` | `completed` | `cancelled`
- `search` (optional): Recherche textuelle
- `sortBy` (optional): `date` | `progress` | `amount`
- `sortOrder` (optional): `asc` | `desc`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Mon Projet",
      "description": "...",
      "goal": 50000,
      "total_raised": 35000,
      "progress_percentage": 70,
      "total_contributors": 12,
      "is_funded": false,
      "created_at": "2024-10-25T10:00:00Z"
    }
  ]
}
```

#### `POST /api/projects`

Crée un nouveau projet.

**Body:**
```json
{
  "title": "Mon Projet",
  "description": "Description détaillée...",
  "goal": 50000,
  "image_url": "https://example.com/image.jpg"
}
```

#### `GET /api/projects/:id`

Récupère un projet avec ses contributions.

### Contributions

#### `POST /api/contributions`

Crée une nouvelle contribution.

**Body:**
```json
{
  "project_id": "uuid",
  "donor_name": "Jean Rakoto",
  "donor_email": "jean@example.com",
  "amount": 5000,
  "message": "Bon courage !"
}
```

---

## 🗄️ Base de Données

### Schéma

#### Table: `projects`

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | PK, auto-generated |
| title | VARCHAR(255) | Titre du projet |
| description | TEXT | Description complète |
| goal | DECIMAL(12,2) | Objectif de financement |
| image_url | TEXT | URL de l'image (nullable) |
| status | VARCHAR(50) | active/completed/cancelled |
| created_at | TIMESTAMPTZ | Date de création |
| updated_at | TIMESTAMPTZ | Dernière mise à jour |

#### Table: `contributions`

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | PK, auto-generated |
| project_id | UUID | FK → projects.id |
| donor_name | VARCHAR(255) | Nom du contributeur |
| donor_email | VARCHAR(255) | Email (nullable) |
| amount | DECIMAL(12,2) | Montant de la contribution |
| message | TEXT | Message de soutien (nullable) |
| created_at | TIMESTAMPTZ | Date de contribution |

#### View: `project_stats`

Vue matérialisée combinant projets et statistiques de contributions.

### Migrations

Les migrations SQL se trouvent dans `supabase/migrations/`.

Pour appliquer :
```bash
# Via Supabase Dashboard : SQL Editor
# Ou via CLI :
supabase db reset
```

---

## 🎯 Choix Techniques

### Pourquoi Next.js ?

- **App Router** : Architecture moderne avec Server/Client Components
- **Performance** : SSR, ISR, streaming
- **SEO-friendly** : Important pour une plateforme publique
- **Full-stack** : API Routes intégrées
- **Deploy facile** : Vercel en 1 clic

### Pourquoi Supabase ?

- **Recommandé dans les specs** du test
- **PostgreSQL** : Base relationnelle production-ready
- **Auto-generated APIs** : Gain de temps sur le CRUD
- **RLS (Row Level Security)** : Sécurité au niveau DB
- **Realtime** : Possibilité d'ajout de features live
- **Gratuit** : Tier free généreux

### Pourquoi FSD (Feature-Sliced Design) ?

- **Scalabilité** : Architecture adaptée aux projets qui grandissent
- **Maintenabilité** : Code organisé par domaine métier
- **Testabilité** : Isolation des layers
- **Onboarding** : Structure claire pour nouveaux devs

### Principes SOLID appliqués

- **Single Responsibility** : Chaque classe/fonction a 1 rôle
  - `Repository` : Accès données uniquement
  - `Service` : Logique métier uniquement
  - `Component` : Affichage uniquement

- **Open/Closed** : Extensions sans modifications
  - Composants réutilisables avec props
  - Services extensibles

- **Dependency Inversion** : Dépendance aux abstractions
  - Types TypeScript comme contrats
  - Interfaces pour les services

### Principes KISS & YAGNI

- **KISS** : Pas de sur-engineering
  - Pas de Redux (React state suffit)
  - Pas d'auth complexe (optionnel pour MVP)
  
- **YAGNI** : On ne code que ce qui est demandé
  - Pas de features non-spec
  - MVP fonctionnel avant optimisations

---

## 🧪 Tests

### Tests manuels

Checklist de tests :
- [ ] Créer un projet
- [ ] Voir la liste des projets
- [ ] Filtrer par statut
- [ ] Trier par date/montant
- [ ] Voir le détail d'un projet
- [ ] Contribuer à un projet
- [ ] Vérifier calcul progression
- [ ] Responsive mobile

### Tests automatisés (à implémenter)

```bash
# À venir
npm run test
npm run test:e2e
```

---

## 🚢 Déploiement

### Vercel (Recommandé)

1. Push le code sur GitHub
2. Importer le projet sur [vercel.com](https://vercel.com)
3. Configurer les variables d'environnement
4. Deploy automatique !

```bash
# Ou via CLI
npm install -g vercel
vercel
```

### Variables d'environnement Vercel

Ajouter dans Project Settings > Environment Variables :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

---

## 👨‍💻 Développement

### Scripts disponibles

```bash
npm run dev          # Serveur de dev
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # Linter
npm run type-check   # Vérification TypeScript
```

### Bonnes pratiques

- Commiter souvent avec messages clairs
- Utiliser les types TypeScript partout
- Valider avec Zod avant envoi API
- Tester manuellement chaque feature
- Documenter les fonctions complexes

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

## 📄 License

MIT

---

## 👤 Auteur

Développé par [Raoelinirina Safidy] dans le cadre du test technique NextA Lead Developer.

**Contact** : safidytiavina21@gmail.com

---

## 🙏 Remerciements

Merci à l'équipe NextA pour cette opportunité de test technique stimulante !