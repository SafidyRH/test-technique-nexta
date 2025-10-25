// ============================================
// src/shared/types/contribution.types.ts
// Types pour l'entité Contribution
// ============================================

import { Project } from "./project.types";

export interface Contribution {
  id: string;
  project_id: string;
  donor_name: string;
  donor_email: string | null;
  amount: number;
  message: string | null;
  created_at: string;
}

export interface ContributionWithProject extends Contribution {
  project: Project;
}

export interface CreateContributionDTO {
  project_id: string;
  donor_name: string;
  donor_email?: string;
  amount: number;
  message?: string;
}

export interface ContributionStats {
  total_amount: number;
  total_count: number;
  average_amount: number;
  largest_contribution: number;
}