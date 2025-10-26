// src/components/molecules/header.tsx

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/atoms/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background py-4 shadow-md">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
        <Link href="/">
            <h1 className="font-bold tracking-tight text-2xl">
            NextA Crowdfunding
            </h1>
        </Link>
        <div className="flex gap-4 justify-end">
          <Link href="/projects/new">
            <Button size="default">
              <Plus className="mr-2 h-5 w-5" />
              Créer un projet
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="default" variant="outline">
              Voir tous les projets
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}