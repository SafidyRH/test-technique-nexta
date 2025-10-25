// ============================================
// src/shared/lib/utils.ts
// Fonctions utilitaires réutilisables
// KISS: Keep It Simple, Stupid - fonctions simples et claires
// ============================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRENCY } from '@/shared/config/constants';

// ============================================
// Styling Utilities
// ============================================

/**
 * Combine les classes CSS avec gestion des conflits Tailwind
 * Utilisé partout dans les composants UI
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// Currency Formatting
// ============================================

/**
 * Formate un montant en devise locale (Ariary malgache)
 * @example formatCurrency(50000) => "50 000 Ar"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' ' + CURRENCY.symbol;
}

/**
 * Formate un montant compact (K, M, B)
 * @example formatCompactCurrency(1500000) => "1,5M Ar"
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1) + 'B ' + CURRENCY.symbol;
  }
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M ' + CURRENCY.symbol;
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K ' + CURRENCY.symbol;
  }
  return amount.toString() + ' ' + CURRENCY.symbol;
}

// ============================================
// Date Formatting
// ============================================

/**
 * Formate une date relative (il y a X jours)
 * @example formatRelativeDate("2024-01-01") => "il y a 3 jours"
 */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInMs = now.getTime() - target.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
  }
  if (diffInMonths > 0) {
    return `il y a ${diffInMonths} mois`;
  }
  if (diffInDays > 0) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  }
  if (diffInHours > 0) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  }
  if (diffInMinutes > 0) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }
  return 'à l\'instant';
}

/**
 * Formate une date au format local
 * @example formatDate("2024-01-01") => "1 janvier 2024"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Formate une date courte
 * @example formatShortDate("2024-01-01") => "01/01/2024"
 */
export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

// ============================================
// Number Formatting
// ============================================

/**
 * Formate un pourcentage
 * @example formatPercentage(75.5) => "75,5%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Formate un nombre avec séparateurs de milliers
 * @example formatNumber(1500) => "1 500"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

// ============================================
// String Utilities
// ============================================

/**
 * Tronque un texte à une longueur donnée
 * @example truncateText("Long text here", 10) => "Long text..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Génère un slug à partir d'un texte
 * @example slugify("Mon Projet Cool") => "mon-projet-cool"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================
// Progress Calculation
// ============================================

/**
 * Calcule le pourcentage de progression
 * @example calculateProgress(75000, 100000) => 75
 */
export function calculateProgress(raised: number, goal: number): number {
  if (goal === 0) return 0;
  const progress = (raised / goal) * 100;
  return Math.min(Math.round(progress * 10) / 10, 100);
}

/**
 * Détermine le statut d'un projet basé sur sa progression
 */
export function getProjectStatus(progress: number): 'pending' | 'in-progress' | 'funded' | 'overfunded' {
  if (progress === 0) return 'pending';
  if (progress < 100) return 'in-progress';
  if (progress === 100) return 'funded';
  return 'overfunded';
}

// ============================================
// Array Utilities
// ============================================

/**
 * Groupe un tableau d'objets par une clé
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Supprime les doublons d'un tableau
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// ============================================
// Delay Utility
// ============================================

/**
 * Crée un délai asynchrone (utile pour démo/tests)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================
// Error Handling
// ============================================

/**
 * Extrait un message d'erreur lisible d'une erreur quelconque
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Une erreur inconnue est survenue';
}