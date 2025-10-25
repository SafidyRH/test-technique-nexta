import { cn, formatCurrency } from "@/shared/lib/utils";
import { Progress } from "../atoms/progress";

interface ProjectStatsProps {
  totalRaised: number;
  goal: number;
  contributors: number;
  progress: number;
  className?: string;
}

export function ProjectStats({
  totalRaised,
  goal,
  contributors,
  progress,
  className,
}: ProjectStatsProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium text-muted-foreground">
          Collecté
        </div>
        <div className="mt-1 text-2xl font-bold">
          {formatCurrency(totalRaised)}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          sur {formatCurrency(goal)}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium text-muted-foreground">
          Progression
        </div>
        <div className="mt-1 text-2xl font-bold">
          {progress}%
        </div>
        <div className="mt-2">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium text-muted-foreground">
          Contributeurs
        </div>
        <div className="mt-1 text-2xl font-bold">
          {contributors}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {contributors > 1 ? 'personnes ont contribué' : 'personne a contribué'}
        </div>
      </div>
    </div>
  );
}