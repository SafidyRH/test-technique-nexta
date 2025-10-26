// ============================================
// src/shared/config/constants.ts
// Constantes de l'application
// ============================================

export const APP_CONFIG = {
  name: 'NextA Crowdfunding',
  description: 'Plateforme de financement participatif pour projets innovants',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 50,
} as const;

export const VALIDATION = {
  project: {
    title: {
      min: 5,
      max: 255,
    },
    description: {
      min: 20,
      max: 5000,
    },
    goal: {
      min: 1000,
      max: 10000000,
    },
  },
  contribution: {
    amount: {
      min: 100,
      max: 1000000,
    },
    donorName: {
      min: 2,
      max: 255,
    },
    message: {
      max: 1000,
    },
  },
} as const;

export const CURRENCY = {
  code: 'MGA',
  symbol: 'Ar',
  locale: 'fr-MG',
} as const;

 // Montants prédéfinis
 export const presetAmounts = [1000, 5000, 10000, 25000, 50000];


export const BUCKET_NAME = 'project-images';
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

 export const STORAGE_CONFIG = {
  bucketName: BUCKET_NAME,
  maxFileSize: MAX_FILE_SIZE,
  allowedTypes: ALLOWED_TYPES,
} as const;
