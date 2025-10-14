'use client';

import Link from 'next/link';
import { Plus, Image } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThemeToggleCompact } from '@/components/theme/ThemeToggle';
import { SearchParams } from '@/types';

interface HeaderProps {
  searchParams: SearchParams;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
}

export function Header({ searchParams, onSearchChange, onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Image className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Explore Gallery</span>
          </Link>

          {/* Search Bar - Hidden on mobile, shown in main content */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchBar
              value={searchParams.query || ''}
              onChange={onSearchChange}
              onSearch={onSearch}
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggleCompact />
            <Link href="/create">
              <Button 
                variant="default" 
                size="sm" 
                className="hidden sm:inline-flex bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="sm:hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="pb-4 md:hidden">
          <SearchBar
            value={searchParams.query || ''}
            onChange={onSearchChange}
            onSearch={onSearch}
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
}