import { ProjectService } from "@/entities/project/model/project.service";
import { ProjectFilters } from "@/components/organims/project-filters";
import { ProjectGrid } from "@/components/organims/projects-grid";

export default async function ProjectsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | undefined }>;
}>) {
  const resolvedSearchParams = await searchParams;  

  const filters = {
    status: resolvedSearchParams.status as any,
    search: resolvedSearchParams.search,
    sortBy: (resolvedSearchParams.sortBy as any) || 'date',
    sortOrder: (resolvedSearchParams.sortOrder as any) || 'desc',
  };

  const result = await ProjectService.getAllProjects(
    filters,
    filters.sortBy,
    filters.sortOrder
  );

  const projects = result.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Tous les projets</h1>
        <p className="text-muted-foreground">
          Découvrez et soutenez les projets innovants
        </p>
      </div>

      <div className="mb-6">
        <ProjectFilters />
      </div>

      <ProjectGrid projects={projects} />
    </div>
  );
}