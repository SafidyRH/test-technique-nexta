# ⚡ Quick Start Guide - NextA Crowdfunding

**Temps estimé : 10 minutes** ⏱️

---

## 📦 Prérequis

- ✅ Node.js 18+ installé
- ✅ npm 9+ installé
- ✅ Compte Supabase (gratuit)
- ✅ Git installé

---

## 🚀 Installation en 5 étapes

### 1️⃣ Cloner et installer

```bash
# Cloner le repository
git clone git@github.com:SafidyRH/test-technique-nexta.git (using SSH key)
cd test-technique-nexta

# Installer les dépendances
npm install
```

### 2️⃣ Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Attendre l'initialisation (~2 minutes)
4. Aller dans **Settings > API**
5. Copier :
   - `Project URL`
   - `anon public` key

### 3️⃣ Configuration environnement

```bash
# Copier le fichier d'exemple
cp .env.local.example .env.local

# Éditer .env.local avec vos clés Supabase
```

Remplir `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_ANON_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4️⃣ Initialiser la base de données

1. Aller dans votre projet Supabase
2. Ouvrir **SQL Editor**
3. Créer une nouvelle query
4. Copier-coller ce script:

-- ============================================
-- NextA Crowdfunding Platform - Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: projects
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  goal DECIMAL(12, 2) NOT NULL CHECK (goal > 0),
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT title_min_length CHECK (LENGTH(TRIM(title)) >= 5),
  CONSTRAINT description_min_length CHECK (LENGTH(TRIM(description)) >= 20)
);

-- ============================================
-- TABLE: contributions
-- ============================================
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255),
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT donor_name_not_empty CHECK (LENGTH(TRIM(donor_name)) > 0),
  CONSTRAINT valid_email CHECK (donor_email IS NULL OR donor_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Index pour les requêtes de projets par date
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Index pour les requêtes de projets par statut
CREATE INDEX idx_projects_status ON projects(status);

-- Index pour les contributions par projet (jointures fréquentes)
CREATE INDEX idx_contributions_project_id ON contributions(project_id);

-- Index pour les contributions par date
CREATE INDEX idx_contributions_created_at ON contributions(created_at DESC);

-- Index composite pour les statistiques de projets
CREATE INDEX idx_contributions_project_amount ON contributions(project_id, amount);

-- ============================================
-- VIEWS for Business Logic
-- ============================================

-- Vue pour les statistiques de projets
CREATE OR REPLACE VIEW project_stats AS
SELECT 
  p.id,
  p.title,
  p.description,
  p.goal,
  p.image_url,
  p.status,
  p.created_at,
  p.updated_at,
  COALESCE(SUM(c.amount), 0) AS total_raised,
  COUNT(c.id) AS total_contributors,
  ROUND(
    (COALESCE(SUM(c.amount), 0) / p.goal * 100)::numeric, 
    2
  ) AS progress_percentage,
  CASE 
    WHEN COALESCE(SUM(c.amount), 0) >= p.goal THEN true 
    ELSE false 
  END AS is_funded
FROM projects p
LEFT JOIN contributions c ON p.id = c.project_id
GROUP BY p.id, p.title, p.description, p.goal, p.image_url, p.status, p.created_at, p.updated_at;

-- ============================================
-- FUNCTIONS for Business Logic
-- ============================================

-- Fonction pour obtenir le total collecté d'un projet
CREATE OR REPLACE FUNCTION get_project_total_raised(project_uuid UUID)
RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM contributions
  WHERE project_id = project_uuid;
$$ LANGUAGE SQL STABLE;

-- Fonction pour obtenir le nombre de contributeurs d'un projet
CREATE OR REPLACE FUNCTION get_project_contributors_count(project_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(DISTINCT id)::INTEGER
  FROM contributions
  WHERE project_id = project_uuid;
$$ LANGUAGE SQL STABLE;

-- Fonction pour calculer le pourcentage de progression
CREATE OR REPLACE FUNCTION get_project_progress(project_uuid UUID)
RETURNS DECIMAL AS $$
  SELECT ROUND(
    (get_project_total_raised(project_uuid) / p.goal * 100)::numeric,
    2
  )
  FROM projects p
  WHERE p.id = project_uuid;
$$ LANGUAGE SQL STABLE;

-- ============================================
-- TRIGGERS for Auto-Update
-- ============================================

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut lire les projets
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

-- Policy: Tout le monde peut créer un projet (pour le MVP, à sécuriser plus tard)
CREATE POLICY "Anyone can create projects"
  ON projects FOR INSERT
  WITH CHECK (true);

-- Policy: Tout le monde peut lire les contributions
CREATE POLICY "Contributions are viewable by everyone"
  ON contributions FOR SELECT
  USING (true);

-- Policy: Tout le monde peut créer une contribution
CREATE POLICY "Anyone can create contributions"
  ON contributions FOR INSERT
  WITH CHECK (true);

-- ============================================
-- SEED DATA for Testing
-- ============================================

-- Insert sample projects
INSERT INTO projects (title, description, goal, image_url, status) VALUES
(
  'Plateforme E-commerce Local',
  'Développement d''une plateforme e-commerce pour connecter les artisans malgaches avec les consommateurs urbains. Application mobile et web responsive avec système de paiement mobile money intégré.',
  50000.00,
  'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
  'active'
),
(
  'Application AgriTech',
  'Solution mobile pour aider les agriculteurs à optimiser leurs cultures grâce à l''IA et aux données météorologiques. Système de prévision des récoltes et marketplace pour vendre directement aux acheteurs.',
  35000.00,
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
  'active'
),
(
  'EduTech - Cours en Ligne',
  'Plateforme d''apprentissage en ligne adaptée au contexte malgache avec des cours hors-ligne, support multiple langues (français, malagasy) et système de certification. Focus sur les compétences numériques.',
  25000.00,
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
  'active'
),
(
  'HealthTech - Télémédecine',
  'Application de téléconsultation médicale pour zones rurales. Connexion patients-médecins via vidéo, système de prescription électronique et livraison de médicaments.',
  60000.00,
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
  'active'
);

-- Insert sample contributions
INSERT INTO contributions (project_id, donor_name, donor_email, amount, message) VALUES
(
  (SELECT id FROM projects WHERE title = 'Plateforme E-commerce Local'),
  'Rakoto Jean',
  'rakoto.jean@example.mg',
  5000.00,
  'Excellent projet pour notre économie locale !'
),
(
  (SELECT id FROM projects WHERE title = 'Plateforme E-commerce Local'),
  'Rasoanaivo Marie',
  'marie.rasoanaivo@example.mg',
  3000.00,
  'Je soutiens cette initiative'
),
(
  (SELECT id FROM projects WHERE title = 'Application AgriTech'),
  'Andriamanalina Paul',
  'paul.andria@example.mg',
  10000.00,
  'En tant qu''agriculteur, j''ai hâte de voir cette solution !'
),
(
  (SELECT id FROM projects WHERE title = 'Application AgriTech'),
  'Randrianasolo Sophie',
  NULL,
  2500.00,
  NULL
),
(
  (SELECT id FROM projects WHERE title = 'EduTech - Cours en Ligne'),
  'Rakotondrabe Luc',
  'luc.rakoto@example.mg',
  8000.00,
  'L''éducation est l''avenir de notre pays'
),
(
  (SELECT id FROM projects WHERE title = 'HealthTech - Télémédecine'),
  'Andrianjafy Voahangy',
  'voahangy@example.mg',
  15000.00,
  'Projet vital pour nos zones rurales'
);

-- ============================================
-- USEFUL QUERIES for Development
-- ============================================

-- Obtenir tous les projets avec leurs stats
-- SELECT * FROM project_stats ORDER BY created_at DESC;

-- Obtenir un projet spécifique avec stats
-- SELECT * FROM project_stats WHERE id = 'uuid-here';

-- Obtenir les top contributeurs
-- SELECT donor_name, SUM(amount) as total_contributed, COUNT(*) as contributions_count
-- FROM contributions
-- GROUP BY donor_name
-- ORDER BY total_contributed DESC
-- LIMIT 10;

-- Obtenir les projets les plus proches de leur objectif
-- SELECT 
--   title, 
--   goal, 
--   total_raised, 
--   progress_percentage
-- FROM project_stats
-- WHERE status = 'active'
-- ORDER BY progress_percentage DESC;


5. Cliquer sur **Run**
6. ✅ Vérifier que les tables `projects` et `contributions` sont créées


### 5️⃣ Lancer l'application

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) 🎉

---

## ✅ Vérification de l'installation

### Checklist

- [ ] Page d'accueil s'affiche
- [ ] Statistiques globales visibles
- [ ] Cliquer sur "Créer un projet" ouvre le formulaire
- [ ] Aucune erreur dans la console

### Si problèmes

**Erreur "Supabase client error"** :
- ✅ Vérifier `.env.local` est bien présent
- ✅ Vérifier les clés Supabase sont correctes
- ✅ Redémarrer le serveur dev (`Ctrl+C` puis `npm run dev`)


**Erreur "Module not found"** :
- ✅ Supprimer `node_modules` et `.next`
- ✅ Relancer `npm install`

---

## 🎯 Premiers pas

### Créer votre premier projet

1. Cliquer sur **"Créer un projet"**
2. Remplir :
   - **Titre** : "Mon premier projet"
   - **Description** : Une description d'au moins 20 caractères
   - **Objectif** : 50000 (Ar)
   - **Image URL** : https://images.unsplash.com/photo-1557821552-17105176677c?w=800
3. Cliquer sur **"Créer le projet"**
4. Vous êtes redirigé vers la page du projet ✅

### Contribuer à un projet

1. Sur la page d'un projet
2. Dans la sidebar droite, sélectionner un montant (ex: 5000 Ar)
3. Remplir votre nom : "Jean Rakoto"
4. Email (optionnel) : jean@example.com
5. Message (optionnel) : "Bon courage !"
6. Cliquer sur **"Contribuer"**
7. La page se recharge avec votre contribution visible ✅

### Filtrer les projets

1. Aller sur **/projects**
2. Utiliser la barre de recherche
3. Filtrer par statut
4. Trier par date/montant/progression

---

## 📚 Ressources utiles

### Documentation

- 📖 [README.md](./README.md) - Documentation complète
- 🏗️ [Architecture](./docs/architecture.md) - Architecture détaillée
- 🗄️ [Database Schema](./docs/database-schema.md) - Schéma BDD

### Structure du code

```
src/
├── app/              → Pages & API Routes
├── entities/         → Projets & Contributions (logique métier)
├── features/         → Formulaires & listes
├── shared/           → Utils, types, config
└── components/ui/    → Composants shadcn/ui
```

### Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter
npm run type-check   # Vérification TypeScript
```

---

## 🔧 Configuration avancée

### Personnaliser les constantes

Éditer `src/shared/config/constants.ts` :

```typescript
export const VALIDATION = {
  project: {
    title: { min: 5, max: 255 },
    goal: { min: 1000, max: 10000000 },
  },
  contribution: {
    amount: { min: 100, max: 1000000 },
  },
};
```

### Changer les couleurs

Éditer `src/app/globals.css` :

```css
:root {
  --primary: 142 71% 45%;      /* Vert NextA */
  --secondary: 210 40% 96%;
  /* ... autres couleurs */
}
```

### Ajouter des images personnalisées

Configurer les domaines autorisés dans `next.config.js` :

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'votre-cdn.com',
    },
  ],
}
```

---

## 🚢 Déploiement rapide

### Vercel (1 clic)

1. Push le code sur GitHub
2. Aller sur [vercel.com/new](https://vercel.com/new)
3. Importer le repository
4. Ajouter les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (sera auto-généré)
5. Cliquer sur **Deploy** 🚀

### Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

---

## 🐛 Debugging

### Activer les logs détaillés

```bash
# Mode debug Next.js
DEBUG=* npm run dev

# Logs Supabase
# Dans Supabase Dashboard > Logs
```

### Outils de développement

- **React DevTools** : [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/)
- **Supabase Dashboard** : Logs, Tables, SQL Editor
- **Network Tab** : Vérifier les appels API

---

## 📞 Support

### Problèmes courants

**Q: Les images ne s'affichent pas**  
R: Vérifier que le domaine est autorisé dans `next.config.js`

**Q: Erreur "Validation failed"**  
R: Vérifier que les données respectent les contraintes (min/max)

**Q: Les stats ne se mettent pas à jour**  
R: Rafraîchir la page ou utiliser `router.refresh()`

### Ressources externes

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ✨ Prochaines étapes

Après avoir lancé l'application avec succès :

1. ✅ Explorer le code dans `src/entities/`
2. ✅ Lire la [documentation architecture](./docs/architecture.md)
3. ✅ Tester toutes les fonctionnalités
4. ✅ Personnaliser les couleurs et le style
5. ✅ Déployer sur Vercel

---

## 🎉 Vous êtes prêt !

L'application est maintenant fonctionnelle. Bonne exploration du code ! 🚀

---

**Besoin d'aide ?** Consultez le [README complet](./README.md) ou la [doc architecture](./docs/architecture.md).