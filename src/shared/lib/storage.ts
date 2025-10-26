import { supabase } from '@/shared/api/supabase-client';
import { ALLOWED_TYPES, BUCKET_NAME, MAX_FILE_SIZE } from '../config/constants';

/**
 * Valide un fichier image
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Vérifier le type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Format non supporté. Utilisez JPG, PNG ou WebP.',
    };
  }

  // Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux. Maximum ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Upload une image vers Supabase Storage
 * @returns URL publique de l'image ou null en cas d'erreur
 */
export async function uploadProjectImage(
  file: File,
  projectId?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validation
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { url: null, error: validation.error || 'Fichier invalide' };
    }

    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = projectId 
      ? `${projectId}-${Date.now()}.${fileExt}`
      : `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: "Erreur lors de l'upload de l'image" };
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { url: null, error: 'Une erreur inattendue est survenue' };
  }
}

/**
 * Supprime une image de Supabase Storage
 */
export async function deleteProjectImage(imageUrl: string): Promise<boolean> {
  try {
    // Extraire le nom du fichier de l'URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

/**
 * Obtient l'URL publique d'une image
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

/**
 * Liste toutes les images d'un projet
 */
export async function listProjectImages(projectId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        search: projectId,
      });

    if (error) {
      console.error('List error:', error);
      return [];
    }

    return data.map((file) => getPublicUrl(file.name));
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

export const STORAGE_CONFIG = {
  bucketName: BUCKET_NAME,
  maxFileSize: MAX_FILE_SIZE,
  allowedTypes: ALLOWED_TYPES,
} as const;