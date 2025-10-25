// ============================================
// src/features/project-list/ui/ProjectFilters.tsx
// Composant de filtres et tri des projets
// ============================================

'use client';

import { Card, CardContent } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ProjectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || 'all';
  const currentSortBy = searchParams.get('sortBy') || 'date';
  const currentSortOrder = searchParams.get('sortOrder') || 'desc';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/projects?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    updateFilters('search', search);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-2">
            <Label htmlFor="search" className="sr-only">
              Rechercher
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                name="search"
                placeholder="Rechercher un projet..."
                defaultValue={currentSearch}
                className="pl-9"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div>
            <Label htmlFor="status" className="sr-only">
              Statut
            </Label>
            <Select
              value={currentStatus}
              onValueChange={(value : string) => updateFilters('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="completed">Terminés</SelectItem>
                <SelectItem value="cancelled">Annulés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div>
            <Label htmlFor="sort" className="sr-only">
              Trier par
            </Label>
            <Select
              value={`${currentSortBy}-${currentSortOrder}`}
              onValueChange={(value : string) => {
                const [sortBy, sortOrder] = value.split('-');
                updateFilters('sortBy', sortBy);
                updateFilters('sortOrder', sortOrder);
              }}
            >
              <SelectTrigger id="sort">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Trier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Plus récents</SelectItem>
                <SelectItem value="date-asc">Plus anciens</SelectItem>
                <SelectItem value="progress-desc">% le plus élevé</SelectItem>
                <SelectItem value="progress-asc">% le plus bas</SelectItem>
                <SelectItem value="amount-desc">Montant le plus élevé</SelectItem>
                <SelectItem value="amount-asc">Montant le plus bas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}