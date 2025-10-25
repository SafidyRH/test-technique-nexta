// ============================================
// src/shared/types/form.types.ts
// Types pour les formulaires
// ============================================

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}