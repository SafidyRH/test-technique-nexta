export type ProjectStatus = 'active' | 'completed' | 'cancelled';

export type SortBy = 'date' | 'progress' | 'amount';
export type SortOrder = 'asc' | 'desc';

export interface Project {
  id: string;
  title: string;
  description: string;
  goal: number;
  image_url: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithStats extends Project {
  total_raised: number;
  total_contributors: number;
  progress_percentage: number;
  is_funded: boolean;
}

export interface CreateProjectDTO {
  title: string;
  description: string;
  goal: number;
  image_url?: string;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  goal?: number;
  image_url?: string;
  status?: ProjectStatus;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  minGoal?: number;
  maxGoal?: number;
  isFunded?: boolean;
  search?: string;
}