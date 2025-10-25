// ============================================
// src/entities/contribution/ui/TopContributors.tsx
// Top contributeurs avec podium
// ============================================

import { cn, formatCurrency, formatRelativeDate } from '@/shared/lib/utils';
import { Trophy, Medal, Award } from 'lucide-react';
import { Card, CardContent } from '../atoms/card';
import { Contribution } from '@/shared/types/contribution.types';

interface TopContributorsProps {
  contributions: Contribution[];
  limit?: number;
}

export function TopContributors({ contributions, limit = 3 }: TopContributorsProps) {
  const topContributions = [...contributions]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, limit);

  const icons = [
    { icon: Trophy, color: "text-yellow-500" },
    { icon: Medal, color: "text-gray-400" },
    { icon: Award, color: "text-orange-600" },
  ];

  if (topContributions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Top Contributeurs</h3>
        <div className="space-y-3">
          {topContributions.map((contribution, index) => {
            const Icon = icons[index]?.icon || Award;
            const colorClass = icons[index]?.color || "text-muted-foreground";

            return (
              <div
                key={contribution.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-5 w-5", colorClass)} />
                  <div>
                    <p className="font-medium">{contribution.donor_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeDate(contribution.created_at)}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-primary">
                  {formatCurrency(Number(contribution.amount))}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}