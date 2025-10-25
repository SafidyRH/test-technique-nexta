// ============================================
// src/app/projects/[id]/page.tsx
// Page détail d'un projet
// ============================================

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatDate, calculateProgress } from '@/shared/lib/utils';
import { ProjectService } from '@/entities/project/model/project.service';
import { Badge } from '@/components/atoms/badge';
import { Calendar } from 'lucide-react';
import { ProgressBar } from '@/components/molecules/progress-bar';
import { ProjectStats } from '@/components/molecules/project-stats';
import { TopContributors } from '@/components/molecules/top-contributors';
import { ContributorList } from '@/components/molecules/contributors-list';
import { ContributeForm } from '@/features/contribution/components/contribute-form';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

    const paramId = (await params).id;

  const result = await ProjectService.getProjectWithContributions(paramId);

  if (!result.success || !result.data) {
    notFound();
  }

  const { project, contributions } = result.data;
  const progress = calculateProgress(
    Number(project.total_raised),
    Number(project.goal)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image */}
          {project.image_url && (
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant={progress >= 100 ? 'secondary' : 'default'}>
                {project.status}
              </Badge>
              <span className="text-sm text-muted-foreground">•</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(project.created_at)}
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-bold">{project.title}</h1>
            
            <ProgressBar
              current={Number(project.total_raised)}
              goal={Number(project.goal)}
              size="lg"
              className="mb-6"
            />

            <ProjectStats
              totalRaised={Number(project.total_raised)}
              goal={Number(project.goal)}
              contributors={project.total_contributors}
              progress={progress}
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">À propos du projet</h2>
            <div className="prose max-w-none whitespace-pre-wrap text-muted-foreground">
              {project.description}
            </div>
          </div>

          {/* Top Contributors */}
          {contributions.length > 0 && (
            <div className="mb-8">
              <TopContributors contributions={contributions} limit={3} />
            </div>
          )}

          {/* Contributions List */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">
              Contributions ({contributions.length})
            </h2>
            <ContributorList contributions={contributions} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ContributeForm
              projectId={project.id}
              projectTitle={project.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}