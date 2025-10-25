// ============================================
// src/entities/project/model/project.repository.ts
// Repository Pattern - Accès aux données (SOLID: Single Responsibility)
// Gère UNIQUEMENT les opérations CRUD avec Supabase
// ============================================

import { createServerSupabaseClient } from '@/shared/api/supabase-server';
import type { 
  Project, 
  ProjectWithStats, 
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectFilters,
  SortBy,
  SortOrder 
} from '@/shared/types/project.types';

export class ProjectRepository {
  /**
   * Récupère tous les projets avec leurs statistiques
   */
  static async findAll(
    filters?: ProjectFilters,
    sortBy: SortBy = 'date',
    sortOrder: SortOrder = 'desc'
  ): Promise<ProjectWithStats[]> {
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from('project_stats')
      .select('*');

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.isFunded !== undefined) {
      query = query.eq('is_funded', filters.isFunded);
    }
    
    if (filters?.minGoal) {
      query = query.gte('goal', filters.minGoal);
    }
    
    if (filters?.maxGoal) {
      query = query.lte('goal', filters.maxGoal);
    }
    
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    // Apply sorting
    const sortColumn = sortBy === 'date' 
      ? 'created_at' 
      : sortBy === 'progress' 
      ? 'progress_percentage' 
      : 'total_raised';
    
    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erreur lors de la récupération des projets: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Récupère un projet par son ID avec statistiques
   */
  static async findById(id: string): Promise<ProjectWithStats | null> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('project_stats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Erreur lors de la récupération du projet: ${error.message}`);
    }

    return data;
  }

  /**
   * Récupère un projet simple (sans stats) par son ID
   */
  static async findByIdSimple(id: string): Promise<Project | null> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erreur lors de la récupération du projet: ${error.message}`);
    }

    return data;
  }

  /**
   * Crée un nouveau projet
   */
  static async create(data: CreateProjectDTO): Promise<Project> {
    const supabase = await createServerSupabaseClient();
    
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        title: data.title,
        description: data.description,
        goal: data.goal,
        image_url: data.image_url || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création du projet: ${error.message}`);
    }

    return project;
  }

  /**
   * Met à jour un projet existant
   */
  static async update(id: string, data: UpdateProjectDTO): Promise<Project> {
    const supabase = await createServerSupabaseClient();
    
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la mise à jour du projet: ${error.message}`);
    }

    return project;
  }

  /**
   * Supprime un projet
   */
  static async delete(id: string): Promise<void> {
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression du projet: ${error.message}`);
    }
  }

  /**
   * Récupère les projets populaires (top contributeurs)
   */
  static async findPopular(limit: number = 5): Promise<ProjectWithStats[]> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('project_stats')
      .select('*')
      .eq('status', 'active')
      .order('total_contributors', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Erreur lors de la récupération des projets populaires: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Récupère les projets récents
   */
  static async findRecent(limit: number = 5): Promise<ProjectWithStats[]> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('project_stats')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Erreur lors de la récupération des projets récents: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Récupère les projets proches de leur objectif
   */
  static async findAlmostFunded(limit: number = 5): Promise<ProjectWithStats[]> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('project_stats')
      .select('*')
      .eq('status', 'active')
      .gte('progress_percentage', 75)
      .lt('progress_percentage', 100)
      .order('progress_percentage', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Erreur lors de la récupération des projets proches du financement: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Compte le nombre total de projets (avec filtres optionnels)
   */
  static async count(filters?: ProjectFilters): Promise<number> {
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Erreur lors du comptage des projets: ${error.message}`);
    }

    return count || 0;
  }
}