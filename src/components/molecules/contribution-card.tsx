// ============================================
// src/entities/contribution/ui/ContributionCard.tsx
// Carte de contribution individuelle
// ============================================

import { User, MessageCircle, Calendar } from 'lucide-react';
import { formatCurrency, formatRelativeDate } from '@/shared/lib/utils';
import type { Contribution } from '@/shared/types/contribution.types';
import { Card, CardContent } from '../atoms/card';

interface ContributionCardProps {
  contribution: Contribution;
}

export function ContributionCard({ contribution }: ContributionCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{contribution.donor_name}</p>
                {contribution.donor_email && (
                  <span className="text-xs text-muted-foreground">
                    {contribution.donor_email}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatRelativeDate(contribution.created_at)}</span>
              </div>

              {contribution.message && (
                <div className="mt-2 flex items-start gap-2 rounded-md bg-muted p-2">
                  <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {contribution.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="flex-shrink-0 text-right">
            <p className="text-lg font-bold text-primary">
              {formatCurrency(Number(contribution.amount))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}