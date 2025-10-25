// ============================================
// src/entities/project/model/project.service.ts
// Service Layer - Logique métier (SOLID: Single Responsibility)
// Contient la logique business, validation et orchestration
// ============================================

import { ProjectRepository } from './project.repository';
import { ContributionRepository } from '@/entities/contribution/model/contribution.repository';
import type { 
  ProjectWithStats, 
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectFilters,
  SortBy,
  SortOrder
} from '@/shared/types/project.types';
import type { ApiResponse } from '@/shared/types/api.types';
import { createProjectSchema, updateProjectSchema, validateData } from '@/shared/lib/validations';

export class ProjectService {
  /**
   * Récupère tous les projets avec filtres et tri
   */
  static async getAllProjects(
    filters?: ProjectFilters,
    sortBy?: SortBy,
    sortOrder?: SortOrder
  ): Promise<ApiResponse<ProjectWithStats[]>> {
    try {
      const projects = await ProjectRepository.findAll(filters, sortBy, sortOrder);
      
      return {
        data: projects,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur inconnue',
        },
        success: false,
      };
    }
  }

  /**
   * Récupère un projet par son ID
   */
  static async getProjectById(id: string): Promise<ApiResponse<ProjectWithStats>> {
    try {
      const project = await ProjectRepository.findById(id);
      
      if (!project) {
        return {
          data: null,
          error: {
            message: 'Projet non trouvé',
            code: 'NOT_FOUND',
          },
          success: false,
        };
      }

      return {
        data: project,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur inconnue',
        },
        success: false,
      };
    }
  }

  /**
   * Récupère un projet avec ses contributions
   */
  static async getProjectWithContributions(id: string): Promise<ApiResponse<{
    project: ProjectWithStats;
    contributions: any[];
  }>> {
    try {
      const project = await ProjectRepository.findById(id);
      
      if (!project) {
        return {
          data: null,
          error: {
            message: 'Projet non trouvé',
            code: 'NOT_FOUND',
          },
          success: false,
        };
      }

      const contributions = await ContributionRepository.findByProjectId(id);

      return {
        data: {
          project,
          contributions,
        },
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur inconnue',
        },
        success: false,
      };
    }
  }

  /**
   * Crée un nouveau projet avec validation
   */
  static async createProject(
    data: CreateProjectDTO
  ): Promise<ApiResponse<any>> {
    try {
      // Validation des données
      const validation = validateData(createProjectSchema, data);
      
      if (!validation.success) {
        return {
          data: null,
          error: {
            message: 'Données invalides',
            details: validation.errors,
          },
          success: false,
        };
      }

      // Création du projet
      const project = await ProjectRepository.create(validation.data);

      return {
        data: project,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur lors de la création',
        },
        success: false,
      };
    }
  }

  /**
   * Met à jour un projet avec validation
   */
  static async updateProject(
    id: string,
    data: UpdateProjectDTO
  ): Promise<ApiResponse<any>> {
    try {
      // Vérification de l'existence du projet
      const existingProject = await ProjectRepository.findByIdSimple(id);
      
      if (!existingProject) {
        return {
          data: null,
          error: {
            message: 'Projet non trouvé',
            code: 'NOT_FOUND',
          },
          success: false,
        };
      }

      // Validation des données
      const validation = validateData(updateProjectSchema, data);
      
      if (!validation.success) {
        return {
          data: null,
          error: {
            message: 'Données invalides',
            details: validation.errors,
          },
          success: false,
        };
      }

      // Mise à jour
      const updatedProject = await ProjectRepository.update(id, validation.data);

      return {
        data: updatedProject,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
        },
        success: false,
      };
    }
  }

  /**
   * Supprime un projet
   */
  static async deleteProject(id: string): Promise<ApiResponse<void>> {
    try {
      const existingProject = await ProjectRepository.findByIdSimple(id);
      
      if (!existingProject) {
        return {
          data: null,
          error: {
            message: 'Projet non trouvé',
            code: 'NOT_FOUND',
          },
          success: false,
        };
      }

      await ProjectRepository.delete(id);

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur lors de la suppression',
        },
        success: false,
      };
    }
  }

  /**
   * Récupère les projets populaires
   */
  static async getPopularProjects(limit: number = 5): Promise<ApiResponse<ProjectWithStats[]>> {
    try {
      const projects = await ProjectRepository.findPopular(limit);
      
      return {
        data: projects,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur inconnue',
        },
        success: false,
      };
    }
  }

  /**
   * Récupère les projets récents
   */
  static async getRecentProjects(limit: number = 5): Promise<ApiResponse<ProjectWithStats[]>> {
    try {
      const projects = await ProjectRepository.findRecent(limit);
      
      return {
        data: projects,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur inconnue',
        },
        success: false,
      };
    }
  }

  /**
   * Vérifie si un projet peut recevoir des contributions
   * Business rule: seuls les projets actifs peuvent recevoir des contributions
   */
  static async canReceiveContributions(projectId: string): Promise<boolean> {
    try {
      const project = await ProjectRepository.findByIdSimple(projectId);
      
      if (!project) {
        return false;
      }

      // Business logic: seuls les projets actifs acceptent les contributions
      return project.status === 'active';
    } catch (error) {
      return false;
    }
  }

  /**
   * Calcule les statistiques globales de la plateforme
   */
  static async getPlatformStats(): Promise<ApiResponse<{
    totalProjects: number;
    activeProjects: number;
    totalFunded: number;
    totalContributions: number;
  }>> {
    try {
      const [totalProjects, activeProjects] = await Promise.all([
        ProjectRepository.count(),
        ProjectRepository.count({ status: 'active' }),
      ]);

      const allProjects = await ProjectRepository.findAll();
      const totalFunded = allProjects.filter(p => p.is_funded).length;
      const totalContributions = allProjects.reduce(
        (sum, p) => sum + p.total_contributors, 
        0
      );

      return {
        data: {
          totalProjects,
          activeProjects,
          totalFunded,
          totalContributions,
        },
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur inconnue',
        },
        success: false,
      };
    }
  }
}