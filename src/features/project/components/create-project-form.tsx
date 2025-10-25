// ============================================
// src/features/create-project/ui/CreateProjectForm.tsx
// Formulaire de création de projet (Feature Layer - FSD)
// ============================================

'use client';

import { useRouter } from 'next/navigation';
import { createProjectSchema } from '@/shared/lib/validations';
import { formatCurrency } from '@/shared/lib/utils';
import type { CreateProjectDTO } from '@/shared/types/project.types';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/atoms/card';
import { Label } from '../../../components/atoms/label';
import { Input } from '../../../components/atoms/input';
import { Textarea } from '../../../components/atoms/textarea';
import { Button } from '../../../components/atoms/button';

interface FormErrors {
  title?: string;
  description?: string;
  goal?: string;
  image_url?: string;
  _form?: string;
}

export function CreateProjectForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<CreateProjectDTO>({
    title: '',
    description: '',
    goal: 0,
    image_url: '',
  });

  const handleInputChange = (
    field: keyof CreateProjectDTO,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    try {
      createProjectSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: FormErrors = {};
      error.errors.forEach((err: any) => {
        const field = err.path[0];
        newErrors[field as keyof FormErrors] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Erreur lors de la création');
      }

      // Redirect to the new project
      router.push(`/projects/${result.data.id}`);
      router.refresh();
    } catch (error) {
      setErrors({
        _form: error instanceof Error ? error.message : 'Une erreur est survenue',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Créer un nouveau projet</CardTitle>
        <CardDescription>
          Partagez votre projet innovant avec la communauté NextA
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Titre du projet <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ex: Plateforme E-commerce Local"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isSubmitting}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre projet en détail (minimum 20 caractères)..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isSubmitting}
              rows={6}
              className={errors.description ? 'border-destructive' : ''}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Minimum 20 caractères</span>
              <span>{formData.description.length} / 5000</span>
            </div>
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal">
              Objectif de financement (Ar) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="goal"
              type="number"
              placeholder="Ex: 50000"
              value={formData.goal || ''}
              onChange={(e) => handleInputChange('goal', Number(e.target.value))}
              disabled={isSubmitting}
              min={1000}
              step={1000}
              className={errors.goal ? 'border-destructive' : ''}
            />
            {formData.goal > 0 && (
              <p className="text-sm text-muted-foreground">
                Objectif: {formatCurrency(formData.goal)}
              </p>
            )}
            {errors.goal && (
              <p className="text-sm text-destructive">{errors.goal}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">URL de l'image (optionnel)</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              disabled={isSubmitting}
              className={errors.image_url ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">
              Utilisez une URL d'image hébergée (Unsplash, Imgur, etc.)
            </p>
            {errors.image_url && (
              <p className="text-sm text-destructive">{errors.image_url}</p>
            )}
          </div>

          {/* Form Error */}
          {errors._form && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{errors._form}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Création...' : 'Créer le projet'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}