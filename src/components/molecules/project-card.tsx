// ============================================
// src/entities/project/ui/ProjectCard.tsx
// Composant carte de projet (Entity Layer - FSD)
// ============================================

import Link from 'next/link';
import Image from 'next/image';
import { 
  formatCurrency, 
  formatRelativeDate, 
  calculateProgress 
} from '@/shared/lib/utils';
import type { ProjectWithStats } from '@/shared/types/project.types';
import { Card, CardContent, CardFooter, CardHeader } from '../atoms/card';
import { Progress } from '../atoms/progress';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import { Button } from '../atoms/button';
import { Badge } from '../atoms/badge';

interface ProjectCardProps {
  project: ProjectWithStats;
  variant?: 'default' | 'compact';
}

export function ProjectCard({ project, variant = 'default' }: Readonly<ProjectCardProps>) {
  const progress = calculateProgress(
    Number(project.total_raised), 
    Number(project.goal)
  );

  const isFunded = progress >= 100;
  const isAlmostFunded = progress >= 75 && progress < 100;

  return (
    <Card className="pt-0 pb-3 group overflow-hidden transition-all hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
            <TrendingUp className="h-16 w-16 text-primary/40" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute right-2 top-2">
          {isFunded ? (
            <Badge variant="secondary">✓ Financé</Badge>
          ) : isAlmostFunded ? (
            <Badge variant="destructive">Bientôt financé</Badge>
          ) : (
            <Badge>En cours</Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <Link 
          href={`/projects/${project.id}`}
          className="group/title"
        >
          <h3 className="line-clamp-2 text-xl font-bold transition-colors group-hover/title:text-primary">
            {project.title}
          </h3>
        </Link>
        
        {variant === 'default' && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-primary">
              {formatCurrency(Number(project.total_raised))}
            </span>
            <span className="text-muted-foreground">
              collectés sur {formatCurrency(Number(project.goal))}
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{progress}% financé</span>
            {!isFunded && (
              <span>
                {formatCurrency(Number(project.goal) - Number(project.total_raised))} restants
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project.total_contributors} contributeur{project.total_contributors > 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatRelativeDate(project.created_at)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button className="w-full" variant={isFunded ? "secondary" : "default"}>
            {isFunded ? 'Voir le projet' : 'Contribuer'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

