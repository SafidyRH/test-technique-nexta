import Link from 'next/link';
import { TrendingUp, Target, Users } from 'lucide-react';
import { ProjectService } from '@/entities/project/model/project.service';
import { Button } from '@/components/atoms/button';
import { ProjectCard } from '@/components/molecules/project-card';
import HeroHeader from '@/widgets/header/hero-header';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const result = await ProjectService.getAllProjects({}, 'date', 'desc');
  const statsResult = await ProjectService.getPlatformStats();

  const projects = result.data || [];
  const stats = statsResult.data;

  return (
    <>
      <HeroHeader />
      <div className="container mx-auto px-4">
        

        {/* Platform Stats */}
        {stats && (
          <section className="mb-12 pt-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 text-center">
                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
                <div className="text-3xl font-bold">{stats.totalProjects}</div>
                <div className="text-sm text-muted-foreground">Projets au total</div>
              </div>
              <div className="rounded-lg border bg-card p-6 text-center">
                <Target className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <div className="text-3xl font-bold">{stats.activeProjects}</div>
                <div className="text-sm text-muted-foreground">Projets actifs</div>
              </div>
              <div className="rounded-lg border bg-card p-6 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                <div className="text-3xl font-bold">{stats.totalContributions}</div>
                <div className="text-sm text-muted-foreground">Contributions</div>
              </div>
              <div className="rounded-lg border bg-card p-6 text-center">
                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
                <div className="text-3xl font-bold">{stats.totalFunded}</div>
                <div className="text-sm text-muted-foreground">Projets financés</div>
              </div>
            </div>
          </section>
        )}

        {/* Projects Grid */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Projets récents</h2>
            <Link href="/projects">
              <Button variant="ghost">Voir tout →</Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Aucun projet pour le moment</p>
              <Link href="/projects/new">
                <Button className="mt-4">Créer le premier projet</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}