

import Link from 'next/link';
import { ProjectService } from '@/entities/project/model/project.service';
import { Plus, TrendingUp, Target, Users } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { ProjectCard } from '@/components/molecules/project-card';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const result = await ProjectService.getAllProjects({}, 'date', 'desc');
  const statsResult = await ProjectService.getPlatformStats();

  const projects = result.data || [];
  const stats = statsResult.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          NextA Crowdfunding
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Soutenez les projets innovants des TPME malgaches et contribuez au développement de l'écosystème entrepreneurial
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/projects/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Créer un projet
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="lg" variant="outline">
              Voir tous les projets
            </Button>
          </Link>
        </div>
      </section>

      {/* Platform Stats */}
      {stats && (
        <section className="mb-12">
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
  );
}





