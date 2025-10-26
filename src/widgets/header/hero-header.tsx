'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/atoms/button';

export default function HeroHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-background transition-all duration-300 ease-in-out ${
        isScrolled ? 'py-4 shadow-md' : 'py-8'
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 transition-all duration-300 ${
          isScrolled ? 'flex items-center justify-between' : 'text-center'
        }`}
      >
        <h1
          className={`font-bold tracking-tight transition-all duration-300 ${
            isScrolled
              ? 'text-2xl'
              : 'mb-4 text-4xl sm:text-5xl'
          }`}
        >
          NextA Crowdfunding
        </h1>

        {!isScrolled && (
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground transition-opacity duration-300">
            Soutenez les projets innovants des TPME malgaches et contribuez au développement de l'écosystème entrepreneurial
          </p>
        )}

        <div
          className={`flex gap-4 transition-all duration-300 ${
            isScrolled ? 'justify-end' : 'justify-center'
          }`}
        >
          <Link href="/projects/new">
            <Button size={isScrolled ? 'default' : 'lg'}>
              <Plus className="mr-2 h-5 w-5" />
              Créer un projet
            </Button>
          </Link>
          <Link href="/projects">
            <Button size={isScrolled ? 'default' : 'lg'} variant="outline">
              Voir tous les projets
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}