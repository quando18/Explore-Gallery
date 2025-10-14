'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { GalleryGrid } from '@/components/Gallery/GalleryGrid';
import { FilterPanel } from '@/components/Filters/FilterPanel';
import { SearchParams } from '@/types';

export default function Home() {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    category: '',
    tags: [],
    sortBy: 'created',
    sortOrder: 'desc',
    page: 1,
  });

  // Check for refresh parameter and clear it from URL
  useEffect(() => {
    const shouldRefresh = urlSearchParams.get('refresh') === 'true';
    if (shouldRefresh) {
      // Remove the refresh parameter from URL without page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('refresh');
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [urlSearchParams, router]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchParams(prev => ({
      ...prev,
      query,
    }));
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchParams(prev => ({
      ...prev,
      query,
      page: 1, // Reset to first page on new search
    }));
  }, []);

  const handleFiltersChange = useCallback((newParams: Partial<SearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams,
    }));
  }, []);

  // Memoize search params to prevent unnecessary re-renders
  const memoizedSearchParams = useMemo(() => searchParams, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchParams={memoizedSearchParams}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />
      
      <main id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <FilterPanel
              searchParams={memoizedSearchParams}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Summary */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {searchParams.query 
                      ? `Results for "${searchParams.query}"`
                      : 'Explore Gallery'
                    }
                  </h1>
                  <p className="text-muted-foreground">
                    Discover amazing photos, designs, and creative works
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <GalleryGrid 
              searchParams={memoizedSearchParams} 
              forceRefresh={urlSearchParams.get('refresh') === 'true'}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
