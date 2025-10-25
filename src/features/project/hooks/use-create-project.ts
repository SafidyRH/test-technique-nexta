// ============================================
// src/features/create-project/model/use-create-project.ts
// Hook personnalisé pour la création de projet
// ============================================

import { useState } from 'react';
import { CreateProjectDTO } from '@/shared/types/project.types';

interface UseCreateProjectReturn {
  createProject: (data: CreateProjectDTO) => Promise<{ success: boolean; data?: any; error?: string }>;
  isLoading: boolean;
  error: string | null;
}

export function useCreateProject(): UseCreateProjectReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (data: CreateProjectDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Erreur lors de la création');
      }

      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { createProject, isLoading, error };
}