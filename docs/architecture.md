# 📐 Documentation Architecture - NextA Crowdfunding

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Logicielle](#architecture-logicielle)
3. [Patterns & Principes](#patterns--principes)
4. [Flux de Données](#flux-de-données)
5. [Sécurité](#sécurité)
6. [Performance](#performance)
7. [Évolutivité](#évolutivité)

---

## Vue d'ensemble

### Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                    (Next.js Frontend)                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Features    │  │  Entities    │     │
│  │  (App Router)│  │  (Business)  │  │  (Domain)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Architecture Logicielle

### 1. Feature-Sliced Design (FSD)

L'application suit l'architecture FSD pour une meilleure organisation et scalabilité.

#### Layers (du plus haut au plus bas niveau)

```
┌─────────────────────────────────────────┐
│  app/          (Pages & Routing)        │  ← Couche Routing
├─────────────────────────────────────────┤
│  widgets/      (Layout Components)      │  ← Couche Layout
├─────────────────────────────────────────┤
│  features/     (User Features)          │  ← Couche Business
├─────────────────────────────────────────┤
│  entities/     (Domain Entities)        │  ← Couche Domaine
├─────────────────────────────────────────┤
│  shared/       (Utils, Config, Types)   │  ← Couche Partagée
└─────────────────────────────────────────┘
```

#### Règles de dépendance

- **Unidirectionnel** : Une couche ne peut importer que des couches inférieures
- **Pas de dépendances circulaires** entre features/entities
- **Shared** : Accessible par toutes les couches

### 2. Structure détaillée

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Layout racine
│   ├── page.tsx                      # Homepage
│   ├── projects/
│   │   ├── page.tsx                  # Liste projets
│   │   ├── [id]/page.tsx             # Détail projet
│   │   └── new/page.tsx              # Création projet
│   └── api/
│       ├── projects/
│       │   ├── route.ts              # GET /POST
│       │   └── [id]/route.ts         # GET /PATCH /DELETE
│       └── contributions/
│           └── route.ts              # POST
│
├── entities/                         # Entités métier
│   ├── project/
│   │   ├── model/
│   │   │   ├── project.repository.ts # Accès données
│   │   │   └── project.service.ts    # Logique métier
│   │   
│   │
│   └── contribution/
│       ├── model/
│       │   ├── contribution.repository.ts
│       │   └── contribution.service.ts
│       
│
├── features/                         # Fonctionnalités utilisateur
│   ├── create-project/
│   │ 
│   │   └── model/
│   │       └── use-create-project.ts # Hook business logic
│   │
│   ├── contribute/
│   │   ├
│   │   └── model/
│   │       └── use-contribute.ts
│   │
│   └── project-list/
│       ├
│       └── model/
│           └── use-project-filters.ts
│
├── widgets/                          # Composants layout
│   ├── header/
│   │   └── Header.tsx
│   └── footer/
│       └── Footer.tsx
│
├── shared/                           # Code partagé
│   ├── api/
│   │   ├── supabase-client.ts        # Client browser
│   │   └── supabase-server.ts        # Client server
│   │
│   ├── lib/
│   │   ├── utils.ts                  # Fonctions utilitaires
│   │   └── validations.ts            # Schémas Zod
│   │
│   ├── types/
│   │   ├── project.types.ts          # Types projets
│   │   ├── contribution.types.ts     # Types contributions
│   │   ├── api.types.ts              # Types API
│   │   └── database.types.ts         # Types Supabase
│   │
│   └── config/
│       └── constants.ts              # Constantes app
│
└── components/ui/                    # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ...
```

---

## Patterns & Principes

### 1. Repository Pattern

**Responsabilité** : Abstraction de l'accès aux données

```typescript
// Repository = CRUD uniquement
export class ProjectRepository {
  static async findAll(filters?) { /* ... */ }
  static async findById(id) { /* ... */ }
  static async create(data) { /* ... */ }
  static async update(id, data) { /* ... */ }
  static async delete(id) { /* ... */ }
}
```

**Avantages** :
- ✅ Isolation de la logique d'accès données
- ✅ Facilite les tests (mock du repository)
- ✅ Changement de source de données transparent

### 2. Service Layer Pattern

**Responsabilité** : Logique métier, validation, orchestration

```typescript
// Service = Business logic
export class ProjectService {
  static async createProject(data) {
    // 1. Validation
    const validation = validateData(schema, data);
    
    // 2. Business rules
    if (!validation.success) return error;
    
    // 3. Appel repository
    return ProjectRepository.create(validation.data);
  }
}
```

**Avantages** :
- ✅ Centralisation de la logique métier
- ✅ Réutilisabilité (API + SSR)
- ✅ Testabilité unitaire

### 3. SOLID Principles

#### Single Responsibility Principle (SRP)
```typescript
// ❌ Mauvais : Tout dans un fichier
function ProjectPage() {
  const data = await fetch(); // Data fetching
  const validated = validate(); // Validation
  return <UI />; // UI rendering
}

// ✅ Bon : Séparation des responsabilités
// Repository → Data access
// Service → Business logic
// Component → UI rendering
```

#### Open/Closed Principle (OCP)
```typescript
// ✅ Extensible sans modification
interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'compact' | 'minimal';
  onAction?: () => void;
}
```

#### Dependency Inversion Principle (DIP)
```typescript
// ✅ Dépendance aux abstractions (types)
async function getProjects(): Promise<ApiResponse<Project[]>> {
  // Implementation peut changer sans affecter les appelants
}
```

### 4. KISS (Keep It Simple, Stupid)

```typescript
// ❌ Over-engineering
class ProjectFacadeFactoryBuilder { /* ... */ }

// ✅ Simple et clair
export async function getProjects(filters) {
  return ProjectRepository.findAll(filters);
}
```

### 5. YAGNI (You Aren't Gonna Need It)

```typescript
// ❌ Code non-nécessaire pour le MVP
function exportProjectToPDF() { /* ... */ }
function shareOnSocialMedia() { /* ... */ }

// ✅ Uniquement ce qui est dans les specs
function createProject(data) { /* ... */ }
function contributeToProject(data) { /* ... */ }
```

---

## Flux de Données

### 1. Création d'un projet

```
User Action
    ↓
┌────────────────────────────────────────┐
│ CreateProjectForm (Feature)            │
│  - Collecte données formulaire         │
│  - Validation client (Zod)             │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ POST /api/projects (API Route)         │
│  - Parse request body                  │
│  - Appel ProjectService                │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ ProjectService.createProject()         │
│  - Validation métier (Zod)             │
│  - Business rules                      │
│  - Appel ProjectRepository             │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ ProjectRepository.create()             │
│  - Supabase insert query               │
│  - Gestion erreurs DB                  │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ Supabase PostgreSQL                    │
│  - INSERT INTO projects                │
│  - Trigger updated_at                  │
│  - Return inserted row                 │
└────────────────┬───────────────────────┘
                 ↓
        Success Response
                 ↓
        Router.push(/projects/:id)
```

### 2. Affichage liste projets

```
Page Load
    ↓
┌────────────────────────────────────────┐
│ /projects Page (Server Component)      │
│  - Parse searchParams                  │
│  - Appel ProjectService                │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ ProjectService.getAllProjects()        │
│  - Validation filtres                  │
│  - Appel Repository avec filtres       │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ ProjectRepository.findAll()            │
│  - Build query avec filtres            │
│  - Sort & pagination                   │
│  - Supabase select from view           │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ Supabase View: project_stats           │
│  - JOIN projects + contributions       │
│  - Calcul agrégations                  │
│  - Return enriched data                │
└────────────────┬───────────────────────┘
                 ↓
        ProjectCard Components
                 ↓
        Rendered HTML (SSR)
```

### 3. Contribution à un projet

```
User fills form
    ↓
┌────────────────────────────────────────┐
│ ContributeForm (Feature)               │
│  - Validation client                   │
│  - Preset amounts                      │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ POST /api/contributions                │
│  - Parse body                          │
│  - Appel ContributionService           │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ ContributionService.create()           │
│  - Validation Zod                      │
│  - Business Rule: canReceiveContrib?   │
│  - Appel Repository                    │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ ContributionRepository.create()        │
│  - INSERT contribution                 │
└────────────────┬───────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ PostgreSQL                             │
│  - Insert in contributions table       │
│  - Update project_stats view           │
└────────────────┬───────────────────────┘
                 ↓
        router.refresh()
                 ↓
        Page re-rendered with new data
```

---

## Sécurité

### 1. Row Level Security (RLS)

Politiques Supabase activées :

```sql
-- Lecture publique
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

-- Création publique (à sécuriser avec auth plus tard)
CREATE POLICY "Anyone can create projects"
  ON projects FOR INSERT
  WITH CHECK (true);
```

### 2. Validation des données

**Double validation** :
1. **Client-side** : Feedback UX rapide
2. **Server-side** : Sécurité garantie

```typescript
// Client
const validation = createProjectSchema.parse(formData);

// Server (API Route)
const validation = validateData(createProjectSchema, body);
if (!validation.success) return error;
```

### 3. Input Sanitization

- ✅ Zod valide les types et formats
- ✅ Trim des strings
- ✅ Limits sur les longueurs
- ✅ Validation email regex

### 4. SQL Injection Protection

✅ **Parameterized queries** via Supabase client (pas de SQL brut)

```typescript
// ✅ Safe
supabase.from('projects').select('*').eq('id', projectId);

// ❌ Unsafe (non utilisé)
// supabase.rpc('raw_sql', { query: `SELECT * FROM projects WHERE id = '${projectId}'` })
```

---

## Performance

### 1. Server-Side Rendering (SSR)

```typescript
// Page server component = SSR automatique
export default async function ProjectsPage() {
  const projects = await ProjectService.getAllProjects();
  return <ProjectGrid projects={projects} />;
}
```

**Avantages** :
- ✅ SEO optimal
- ✅ Time to First Byte rapide
- ✅ Pas de loading spinner initial

### 2. Caching Strategy

```typescript
// Static: Cache infini
export const revalidate = false;

// ISR: Revalidation toutes les 60s
export const revalidate = 60;

// Dynamic: Pas de cache
export const dynamic = 'force-dynamic';
```

### 3. Image Optimization

```typescript
<Image
  src={project.image_url}
  alt={project.title}
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  className="object-cover"
/>
```

**Avantages Next.js Image** :
- ✅ Lazy loading automatique
- ✅ WebP conversion
- ✅ Responsive images

### 4. Database Indexing

```sql
-- Index sur colonnes fréquemment requêtées
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_contributions_project_id ON contributions(project_id);
```

### 5. Database View pour stats

```sql
-- Vue matérialisée pour éviter calculs répétés
CREATE VIEW project_stats AS
SELECT 
  p.*,
  COALESCE(SUM(c.amount), 0) AS total_raised,
  COUNT(c.id) AS total_contributors,
  -- ... plus de calculs
FROM projects p
LEFT JOIN contributions c ON p.id = c.project_id
GROUP BY p.id;
```

---

## Évolutivité

### 1. Features futures facilement intégrables

**Authentication** :
```typescript
// Ajouter NextAuth.js sans refactoring
import { getServerSession } from "next-auth";

export async function POST(request) {
  const session = await getServerSession();
  if (!session) return unauthorized;
  // ... existing code
}
```

**Realtime Updates** :
```typescript
// Supabase Realtime déjà disponible
useEffect(() => {
  const channel = supabase
    .channel('contributions')
    .on('INSERT', payload => {
      // Update UI en temps réel
    })
    .subscribe();
}, []);
```

**Payments Integration** :
```typescript
// Ajouter Stripe dans ContributionService
async createContribution(data) {
  // 1. Validation
  // 2. Create Stripe PaymentIntent
  // 3. Save contribution
}
```

### 2. Scaling Database

**Vertical Scaling** :
- Supabase propose des tiers Plus/Pro/Enterprise

**Horizontal Scaling** :
- Read replicas disponibles sur tiers Pro
- Partitioning par date si volume énorme

### 3. Caching Layer

```typescript
// Ajouter Redis facilement
import { Redis } from '@upstash/redis';

async function getProjects() {
  const cached = await redis.get('projects:all');
  if (cached) return cached;
  
  const fresh = await ProjectRepository.findAll();
  await redis.set('projects:all', fresh, { ex: 60 });
  return fresh;
}
```

### 4. Monitoring & Logging

```typescript
// Ajouter Sentry/LogRocket
import * as Sentry from "@sentry/nextjs";

try {
  await ProjectService.createProject(data);
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

---

## Diagrammes

### Architecture des composants

```
┌──────────────────────────────────────────────────┐
│              PRESENTATION LAYER                   │
│                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │   Pages    │  │  Features  │  │   Widgets  │ │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘ │
│        │                │                │        │
│        └────────────────┴────────────────┘        │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────┴─────────────────────────────┐
│              BUSINESS LAYER                       │
│                                                   │
│  ┌────────────┐  ┌────────────┐                  │
│  │  Services  │  │   Entities │                  │
│  └─────┬──────┘  └─────┬──────┘                  │
│        │                │                         │
│        └────────────────┘                         │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────┴─────────────────────────────┐
│              DATA ACCESS LAYER                    │
│                                                   │
│  ┌────────────┐  ┌────────────┐                  │
│  │Repositories│  │  Supabase  │                  │
│  └─────┬──────┘  └─────┬──────┘                  │
│        │                │                         │
│        └────────────────┘                         │
└────────────────────┬─────────────────────────────┘
                     │
              ┌──────┴──────┐
              │  PostgreSQL  │
              └─────────────┘
```

---

## Conclusion

Cette architecture a été conçue pour :

✅ **Maintenabilité** : Code organisé et prévisible  
✅ **Scalabilité** : Facile à étendre avec nouvelles features  
✅ **Testabilité** : Layers isolés et testables unitairement  
✅ **Performance** : SSR, caching, indexation DB  
✅ **Sécurité** : Validation, RLS, prepared statements  
✅ **Developer Experience** : TypeScript strict, patterns clairs  

L'architecture FSD + SOLID permet une croissance maîtrisée du projet tout en gardant une complexité manageable pour un MVP de 3 jours-homme.┘  └──────────────┘  └──────────────┘     │
│           │                │                  │             │
│           └────────────────┴──────────────────┘             │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
                   HTTPS / REST API
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    SERVER LAYER                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  API Routes  │  │   Services   │  │ Repositories │     │
│  │  (Next.js)   │  │  (Business)  │  │ (Data Access)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│           │                │                  │             │
│           └────────────────┴──────────────────┘             │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
                   Supabase Client SDK
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                   SUPABASE (BaaS)                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │     RLS      │  │   Realtime   │     │
│  │   Database   │  │   Security   │  │  (Optional)  │     │
│  └──────────────