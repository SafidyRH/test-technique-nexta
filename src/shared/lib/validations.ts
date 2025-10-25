// ============================================
// src/shared/lib/validations.ts
// Schémas de validation avec Zod
// SOLID: Single Responsibility - chaque schéma valide une entité
// ============================================
import { z } from 'zod';
import { VALIDATION } from '@/shared/config/constants';

// ============================================
// Project Validations
// ============================================
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.project.title.min, {
      message: `Le titre doit contenir au moins ${VALIDATION.project.title.min} caractères`,
    })
    .max(VALIDATION.project.title.max, {
      message: `Le titre ne peut pas dépasser ${VALIDATION.project.title.max} caractères`,
    })
    .trim(),
  description: z
    .string()
    .min(VALIDATION.project.description.min, {
      message: `La description doit contenir au moins ${VALIDATION.project.description.min} caractères`,
    })
    .max(VALIDATION.project.description.max, {
      message: `La description ne peut pas dépasser ${VALIDATION.project.description.max} caractères`,
    })
    .trim(),
  goal: z
    .number()
    .positive({ message: "L'objectif doit être un nombre positif" })
    .min(VALIDATION.project.goal.min, {
      message: `L'objectif minimum est de ${VALIDATION.project.goal.min} Ar`,
    })
    .max(VALIDATION.project.goal.max, {
      message: `L'objectif maximum est de ${VALIDATION.project.goal.max} Ar`,
    }),
  image_url: z
    .string()
    .url({ message: "L'URL de l'image n'est pas valide" })
    .optional()
    .or(z.literal('')),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial().extend({
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ============================================
// Contribution Validations
// ============================================
export const createContributionSchema = z.object({
  project_id: z
    .string()
    .uuid({ message: "L'identifiant du projet n'est pas valide" }),
  donor_name: z
    .string()
    .min(VALIDATION.contribution.donorName.min, {
      message: `Le nom doit contenir au moins ${VALIDATION.contribution.donorName.min} caractères`,
    })
    .max(VALIDATION.contribution.donorName.max, {
      message: `Le nom ne peut pas dépasser ${VALIDATION.contribution.donorName.max} caractères`,
    })
    .trim(),
  donor_email: z
    .string()
    .email({ message: "L'email n'est pas valide" })
    .optional()
    .or(z.literal('')),
  amount: z
    .number()
    .positive({ message: "Le montant doit être un nombre positif" })
    .min(VALIDATION.contribution.amount.min, {
      message: `Le montant minimum est de ${VALIDATION.contribution.amount.min} Ar`,
    })
    .max(VALIDATION.contribution.amount.max, {
      message: `Le montant maximum est de ${VALIDATION.contribution.amount.max} Ar`,
    }),
  message: z
    .string()
    .max(VALIDATION.contribution.message.max, {
      message: `Le message ne peut pas dépasser ${VALIDATION.contribution.message.max} caractères`,
    })
    .optional()
    .or(z.literal('')),
});

export type CreateContributionInput = z.infer<typeof createContributionSchema>;

// ============================================
// Filter & Sort Validations
// ============================================
export const projectFiltersSchema = z.object({
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
  minGoal: z.number().positive().optional(),
  maxGoal: z.number().positive().optional(),
  isFunded: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'progress', 'amount']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ProjectFiltersInput = z.infer<typeof projectFiltersSchema>;

// ============================================
// Utility Functions
// ============================================

/**
 * Valide et parse des données avec un schéma Zod
 * Retourne soit les données validées, soit les erreurs
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { success: false, errors };
  }
}

/**
 * Valide des données de manière asynchrone
 * Utile pour les validations avec appels externes
 */
export async function validateDataAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: Record<string, string> }> {
  const result = await schema.safeParseAsync(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { success: false, errors };
  }
}