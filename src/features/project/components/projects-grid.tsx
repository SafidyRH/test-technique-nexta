import { ProjectCard } from '@/components/molecules/project-card';
import type { ProjectWithStats } from '@/shared/types/project.types';
import { Search } from 'lucide-react';

interface ProjectGridProps {
  projects: ProjectWithStats[];
}

export function ProjectGrid({ projects }: Readonly<ProjectGridProps>) {
  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Aucun projet trouvé</h3>
        <p className="text-sm text-muted-foreground">
          Essayez de modifier vos filtres ou créez un nouveau projet
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {projects.length} projet{projects.length > 1 ? 's' : ''} trouvé{projects.length > 1 ? 's' : ''}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}