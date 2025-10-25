'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createContributionSchema } from '@/shared/lib/validations';
import { formatCurrency } from '@/shared/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { ContributeFormProps, FormErrors } from '../types/contribute.types';
import { presetAmounts } from '@/shared/config/constants';


export function ContributeForm({ projectId, projectTitle, onSuccess }: Readonly<ContributeFormProps>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState({
    project_id: projectId,
    donor_name: '',
    donor_email: '',
    amount: 0,
    message: '',
  });

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      createContributionSchema.parse(formData);
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
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Erreur lors de la contribution');
      }

      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }

      // Reset form
      setFormData({
        project_id: projectId,
        donor_name: '',
        donor_email: '',
        amount: 0,
        message: '',
      });
    } catch (error) {
      setErrors({
        _form: error instanceof Error ? error.message : 'Une erreur est survenue',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribuer au projet</CardTitle>
        <CardDescription>
          {projectTitle}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preset Amounts */}
          <div className="space-y-2">
            <Label>Montant rapide</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={formData.amount === amount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('amount', amount)}
                  disabled={isSubmitting}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Montant personnalisé (Ar) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Votre montant"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', Number(e.target.value))}
              disabled={isSubmitting}
              min={100}
              step={100}
              className={errors.amount ? 'border-destructive' : ''}
            />
            {formData.amount > 0 && (
              <p className="text-sm text-muted-foreground">
                Vous contribuez: {formatCurrency(formData.amount)}
              </p>
            )}
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Donor Name */}
          <div className="space-y-2">
            <Label htmlFor="donor_name">
              Votre nom <span className="text-destructive">*</span>
            </Label>
            <Input
              id="donor_name"
              placeholder="Ex: Jean Rakoto"
              value={formData.donor_name}
              onChange={(e) => handleInputChange('donor_name', e.target.value)}
              disabled={isSubmitting}
              className={errors.donor_name ? 'border-destructive' : ''}
            />
            {errors.donor_name && (
              <p className="text-sm text-destructive">{errors.donor_name}</p>
            )}
          </div>

          {/* Donor Email */}
          <div className="space-y-2">
            <Label htmlFor="donor_email">Email (optionnel)</Label>
            <Input
              id="donor_email"
              type="email"
              placeholder="votreemail@example.com"
              value={formData.donor_email}
              onChange={(e) => handleInputChange('donor_email', e.target.value)}
              disabled={isSubmitting}
              className={errors.donor_email ? 'border-destructive' : ''}
            />
            {errors.donor_email && (
              <p className="text-sm text-destructive">{errors.donor_email}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message de soutien (optionnel)</Label>
            <Textarea
              id="message"
              placeholder="Laissez un message d'encouragement..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className={errors.message ? 'border-destructive' : ''}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          {/* Form Error */}
          {errors._form && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{errors._form}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || formData.amount === 0}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Contribution en cours...' : `Contribuer ${formData.amount > 0 ? formatCurrency(formData.amount) : ''}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
