// ============================================
// src/app/projects/new/page.tsx
// Page création de projet
// ============================================

import { CreateProjectForm } from "@/features/project/components/create-project-form";


export default function NewProjectPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Créer un nouveau projet</h1>
        <p className="text-muted-foreground">
          Partagez votre projet innovant avec la communauté
        </p>
      </div>

      <CreateProjectForm />
    </div>
  );
}