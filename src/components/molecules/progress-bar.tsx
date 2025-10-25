// ============================================
// src/entities/project/ui/ProgressBar.tsx
// Composant barre de progression personnalisée
// ============================================

import { calculateProgress, cn, formatCurrency } from "@/shared/lib/utils";

interface ProgressBarProps {
  current: number;
  goal: number;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  current,
  goal,
  showLabels = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const progress = calculateProgress(current, goal);
  const remaining = Math.max(0, goal - current);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn("space-y-2", className)}>
      {showLabels && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">
            {formatCurrency(current)}
          </span>
          <span className="text-muted-foreground">
            {formatCurrency(goal)}
          </span>
        </div>
      )}

      <div className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary",
        heightClasses[size]
      )}>
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            progress >= 100 
              ? "bg-green-500" 
              : progress >= 75
              ? "bg-yellow-500"
              : "bg-primary"
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {showLabels && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progress}% financé</span>
          {progress < 100 && (
            <span>{formatCurrency(remaining)} restants</span>
          )}
        </div>
      )}
    </div>
  );
}