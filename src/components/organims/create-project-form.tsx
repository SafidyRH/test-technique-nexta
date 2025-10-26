'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema } from '@/shared/lib/validations';
import { formatCurrency } from '@/shared/lib/utils';
import type { CreateProjectDTO } from '@/shared/types/project.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Label } from '@/components/atoms/label';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { Button } from '@/components/atoms/button';
import { ImageUpload } from '@/components/molecules/image-upload'; // Adjust path as needed

export function CreateProjectForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateProjectDTO>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      goal: 0,
      image_url: '',
    },
  });

  const goal = watch('goal');
  const description = watch('description');

  const onSubmit = async (data: CreateProjectDTO) => {
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

      // Redirect to the new project
      router.push(`/projects/${result.data.id}`);
      router.refresh();
    } catch (error) {
      console.error('Submission error:', error);
      // You can set a form-level error here if needed, e.g., using setError
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Titre du projet <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ex: Plateforme E-commerce Local"
              disabled={isSubmitting}
              className={errors.title ? 'border-destructive' : ''}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
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
              disabled={isSubmitting}
              rows={6}
              className={errors.description ? 'border-destructive' : ''}
              {...register('description')}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Minimum 20 caractères</span>
              <span>{description?.length || 0} / 5000</span>
            </div>
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
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
              disabled={isSubmitting}
              min={1000}
              step={1000}
              className={errors.goal ? 'border-destructive' : ''}
              {...register('goal', { valueAsNumber: true })}
            />
            {goal > 0 && (
              <p className="text-sm text-muted-foreground">
                Objectif: {formatCurrency(goal)}
              </p>
            )}
            {errors.goal && (
              <p className="text-sm text-destructive">{errors.goal.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <ImageUpload
            label="Image du projet (optionnel)"
            value={watch('image_url') || null}
            onChange={(url) => setValue('image_url', url || '')}
            error={errors.image_url?.message}
            disabled={isSubmitting}
          />

          {/* Form Error - Handle globally if needed, or use root errors */}
          {errors.root && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{errors.root.message}</p>
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