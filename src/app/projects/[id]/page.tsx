
import { notFound } from 'next/navigation';
import { ProjectService } from '@/entities/project/model/project.service';
import { ProjectDetailView } from '@/components/organims/project-detail';

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

  return (
    <ProjectDetailView 
      project={project} 
      contributions={contributions} 
    />
  );
}