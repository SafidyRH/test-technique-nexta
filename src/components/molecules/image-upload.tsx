'use client';

import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { validateImageFile, uploadProjectImage, STORAGE_CONFIG } from '@/shared/lib/storage';
import { Label } from '../atoms/label';

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function ImageUpload({
  label = 'Image du projet',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Fichier invalide');
      return;
    }

    setUploadError(null);

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload vers Supabase
    setIsUploading(true);
    try {
      const { url, error: uploadError } = await uploadProjectImage(file);

      if (uploadError || !url) {
        setUploadError(uploadError || "Erreur lors de l'upload");
        setPreview(null);
        return;
      }

      onChange(url);
    } catch (error) {
      setUploadError('Une erreur est survenue');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="space-y-2">
        {/* Preview ou Zone d'upload */}
        {preview ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground transition-colors hover:bg-destructive/90"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isUploading}
            className={cn(
              "relative flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
              error ? "border-destructive" : "border-muted-foreground/25",
              !disabled && "hover:border-primary hover:bg-muted/50",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Upload en cours...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                <div className="mt-2 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">Cliquez pour uploader</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG, WebP jusqu'à {STORAGE_CONFIG.maxFileSize / 1024 / 1024}MB
                </p>
              </>
            )}
          </button>
        )}

        {/* Input caché */}
        <input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept={STORAGE_CONFIG.allowedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="sr-only"
        />

        {/* Messages d'erreur */}
        {(error || uploadError) && (
          <p className="text-sm text-destructive">{error || uploadError}</p>
        )}

        {/* Info */}
        {!error && !uploadError && preview && !isUploading && (
          <p className="text-xs text-muted-foreground">
            ✓ Image uploadée avec succès
          </p>
        )}
      </div>
    </div>
  );
}