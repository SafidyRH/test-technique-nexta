import { Pagination } from '@/components/molecules/pagination';
import { ProjectFilters } from '@/components/organims/project-filters';
import { ProjectGrid } from '@/components/organims/projects-grid';
import { ProjectService } from '@/entities/project/model/project.service';

export const revalidate = 60;

export default async function ProjectsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | undefined }>; // ← Promise maintenant
}>) {
  const params = await searchParams;
  
  const page = Math.max(1, Number.parseInt(params.page || '1', 10));
  const pageSize = 6;
  
  const filters = {
    status: params.status as any,
    search: params.search,
    sortBy: (params.sortBy as any) || 'date',
    sortOrder: (params.sortOrder as any) || 'desc',
  };

  const result = await ProjectService.getAllProjectsPaginated(
    filters,
    filters.sortBy,
    filters.sortOrder,
    { page, pageSize }
  );

  const paginatedData = result.data;

  if (!paginatedData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-destructive">Erreur de chargement des projets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Tous les projets</h1>
        <p className="text-muted-foreground">
          {paginatedData.pagination.totalCount} projet{paginatedData.pagination.totalCount > 1 ? 's' : ''} trouvé{paginatedData.pagination.totalCount > 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-6">
        <ProjectFilters />
      </div>

      <ProjectGrid projects={paginatedData.data} />

      {/* Pagination */}
      {paginatedData.pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={paginatedData.pagination.page}
            totalPages={paginatedData.pagination.totalPages}
            hasNextPage={paginatedData.pagination.hasNextPage}
            hasPreviousPage={paginatedData.pagination.hasPreviousPage}
          />
        </div>
      )}
    </div>
  );
}