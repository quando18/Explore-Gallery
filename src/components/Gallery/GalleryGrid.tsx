'use client';

import { GalleryItem } from './GalleryItem';
import { InfiniteScroll } from './InfiniteScroll';
import { useInfiniteItems } from '@/hooks/useInfiniteItems';
import { SearchParams } from '@/types';
import { cn } from '@/lib/utils';

interface GalleryGridProps {
  searchParams: SearchParams;
  className?: string;
  forceRefresh?: boolean;
}

export function GalleryGrid({ searchParams, className, forceRefresh }: GalleryGridProps) {
  const { 
    items, 
    hasNextPage, 
    isLoading, 
    isLoadingMore, 
    isError, 
    loadMore 
  } = useInfiniteItems(searchParams, forceRefresh);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-destructive mb-4">
          <svg
            className="h-12 w-12 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">Failed to load gallery items. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary hover:underline"
        >
          Refresh page
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden border border-border animate-pulse">
            <div className="aspect-[4/3] bg-muted" />
            <div className="p-4">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-2/3 mb-3" />
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-16" />
                <div className="h-3 bg-muted rounded w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground mb-4">
          <svg
            className="h-12 w-12 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      hasNextPage={hasNextPage}
      isLoading={isLoadingMore}
      fetchNextPage={loadMore}
    >
      <div 
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6",
          className
        )}
        data-testid="gallery-grid"
      >
        {items.map((item, index) => (
          <GalleryItem
            key={item.id}
            item={item}
            priority={index < 4} // Prioritize first 4 images
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}