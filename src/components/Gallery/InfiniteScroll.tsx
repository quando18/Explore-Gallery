'use client';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  hasNextPage: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
  children: React.ReactNode;
}

export function InfiniteScroll({
  hasNextPage,
  isLoading,
  fetchNextPage,
  children
}: InfiniteScrollProps) {
  const { loadingRef, isFetching } = useInfiniteScroll({
    hasNextPage,
    isLoading,
    fetchNextPage,
    threshold: 300,
  });

  return (
    <div className="w-full">
      {children}
      
      {/* Loading indicator */}
      <div ref={loadingRef} className="flex justify-center py-8">
        {(isLoading || isFetching) && hasNextPage && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more items...</span>
          </div>
        )}
        
        {!hasNextPage && !isLoading && (
          <div className="text-center text-muted-foreground">
            <p>You've reached the end! 🎉</p>
            <p className="text-sm mt-1">No more items to load.</p>
          </div>
        )}
      </div>
    </div>
  );
}