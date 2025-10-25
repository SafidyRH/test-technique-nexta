
import { Award, TrendingUp, Trophy, Users } from "lucide-react";
import { formatCurrency } from "@/shared/lib/utils";
import { Card, CardContent } from "../atoms/card";

interface ContributionStatsDisplayProps {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  largestContribution: number;
}

export function ContributionStatsDisplay({
  totalAmount,
  totalCount,
  averageAmount,
  largestContribution,
}: ContributionStatsDisplayProps) {
  const stats = [
    {
      label: 'Total collecté',
      value: formatCurrency(totalAmount),
      icon: TrendingUp,
    },
    {
      label: 'Nombre de contributions',
      value: totalCount.toString(),
      icon: Users,
    },
    {
      label: 'Contribution moyenne',
      value: formatCurrency(averageAmount),
      icon: Award,
    },
    {
      label: 'Plus grande contribution',
      value: formatCurrency(largestContribution),
      icon: Trophy,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}