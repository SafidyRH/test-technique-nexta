import { ContributionRepository } from './contribution.repository';
import { ProjectService } from '@/entities/project/model/project.service';
import { createContributionSchema, validateData } from '@/shared/lib/validations';
import type { CreateContributionDTO } from '@/shared/types/contribution.types';
import type { ApiResponse } from '@/shared/types/api.types';

export class ContributionService {
  /**
   * Crée une nouvelle contribution avec validation métier
   */
  static async createContribution(
    data: CreateContributionDTO
  ): Promise<ApiResponse<any>> {
    try {
      // Validation des données
      const validation = validateData(createContributionSchema, data);
      
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

      // Business Rule: Vérifier si le projet peut recevoir des contributions
      const canContribute = await ProjectService.canReceiveContributions(data.project_id);
      
      if (!canContribute) {
        return {
          data: null,
          error: {
            message: 'Ce projet ne peut plus recevoir de contributions',
            code: 'PROJECT_NOT_ACTIVE',
          },
          success: false,
        };
      }

      // Créer la contribution
      const contribution = await ContributionRepository.create(validation.data);

      return {
        data: contribution,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Erreur lors de la contribution',
        },
        success: false,
      };
    }
  }

  /**
   * Récupère les contributions d'un projet
   */
  static async getProjectContributions(projectId: string): Promise<ApiResponse<any[]>> {
    try {
      const contributions = await ContributionRepository.findByProjectId(projectId);
      
      return {
        data: contributions,
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
   * Récupère les statistiques des contributions d'un projet
   */
  static async getProjectContributionStats(projectId: string): Promise<ApiResponse<any>> {
    try {
      const stats = await ContributionRepository.getStatsByProjectId(projectId);
      
      return {
        data: stats,
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
   * Récupère les top contributeurs d'un projet
   */
  static async getTopContributors(projectId: string, limit: number = 5): Promise<ApiResponse<any[]>> {
    try {
      const topContributors = await ContributionRepository.findTopContributors(projectId, limit);
      
      return {
        data: topContributors,
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