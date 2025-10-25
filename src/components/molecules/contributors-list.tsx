// ============================================
// src/entities/contribution/ui/ContributorList.tsx
// Liste des contributeurs d'un projet
// ============================================

import { cn } from '@/shared/lib/utils';
import { Contribution } from '@/shared/types/contribution.types';
import { User } from 'lucide-react';
import { ContributionCard } from './contribution-card';

interface ContributorListProps {
  contributions: Contribution[];
  limit?: number;
  showAll?: boolean;
  className?: string;
}

export function ContributorList({ 
  contributions, 
  limit = 5,
  showAll = false,
  className 
}: ContributorListProps) {
  const displayedContributions = showAll 
    ? contributions 
    : contributions.slice(0, limit);
  
  const remainingCount = contributions.length - displayedContributions.length;

  if (contributions.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Aucune contribution pour le moment
        </p>
        <p className="text-xs text-muted-foreground">
          Soyez le premier à contribuer !
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {displayedContributions.map((contribution) => (
        <ContributionCard key={contribution.id} contribution={contribution} />
      ))}

      {!showAll && remainingCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            + {remainingCount} autre{remainingCount > 1 ? 's' : ''} contributeur{remainingCount > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
