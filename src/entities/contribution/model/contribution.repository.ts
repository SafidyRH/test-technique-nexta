import { createServerSupabaseClient } from '@/shared/api/supabase-server';
import type { 
  Contribution, 
  CreateContributionDTO,
  ContributionStats 
} from '@/shared/types/contribution.types';

export class ContributionRepository {
  /**
   * Récupère toutes les contributions d'un projet
   */
  static async findByProjectId(projectId: string): Promise<Contribution[]> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des contributions: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Récupère une contribution par son ID
   */
  static async findById(id: string): Promise<Contribution | null> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erreur lors de la récupération de la contribution: ${error.message}`);
    }

    return data;
  }

  /**
   * Crée une nouvelle contribution
   */
  static async create(data: CreateContributionDTO): Promise<Contribution> {
    const supabase = await createServerSupabaseClient();
    
    const { data: contribution, error } = await supabase
      .from('contributions')
      .insert({
        project_id: data.project_id,
        donor_name: data.donor_name,
        donor_email: data.donor_email || null,
        amount: data.amount,
        message: data.message || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de la contribution: ${error.message}`);
    }

    return contribution;
  }

  /**
   * Récupère les statistiques des contributions d'un projet
   */
  static async getStatsByProjectId(projectId: string): Promise<ContributionStats> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('contributions')
      .select('amount')
      .eq('project_id', projectId);

    if (error) {
      throw new Error(`Erreur lors du calcul des statistiques: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        total_amount: 0,
        total_count: 0,
        average_amount: 0,
        largest_contribution: 0,
      };
    }

    const amounts = data.map(c => Number(c.amount));
    const total = amounts.reduce((sum, amount) => sum + amount, 0);

    return {
      total_amount: total,
      total_count: amounts.length,
      average_amount: total / amounts.length,
      largest_contribution: Math.max(...amounts),
    };
  }

  /**
   * Récupère les dernières contributions (global)
   */
  static async findRecent(limit: number = 10): Promise<Contribution[]> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Erreur lors de la récupération des contributions récentes: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Récupère les top contributeurs d'un projet
   */
  static async findTopContributors(projectId: string, limit: number = 5): Promise<Contribution[]> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('project_id', projectId)
      .order('amount', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Erreur lors de la récupération des top contributeurs: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Compte le nombre de contributions d'un projet
   */
  static async countByProjectId(projectId: string): Promise<number> {
    const supabase = await createServerSupabaseClient();
    
    const { count, error } = await supabase
      .from('contributions')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (error) {
      throw new Error(`Erreur lors du comptage des contributions: ${error.message}`);
    }

    return count || 0;
  }
}