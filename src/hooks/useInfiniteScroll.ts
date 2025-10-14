import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
  threshold?: number; // Distance from bottom before triggering (in pixels)
}

export function useInfiniteScroll({
  hasNextPage,
  isLoading,
  fetchNextPage,
  threshold = 300
}: UseInfiniteScrollOptions) {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isLoading && !isFetching) {
      setIsFetching(true);
      fetchNextPage();
    }
  }, [hasNextPage, isLoading, isFetching, fetchNextPage]);

  useEffect(() => {
    const element = loadingRef.current;
    if (!element) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false);
    }
  }, [isLoading]);

  return { loadingRef, isFetching };
}

// Alternative hook for manual scroll detection (fallback)
export function useScrollInfinite({
  hasNextPage,
  isLoading,
  fetchNextPage,
  threshold = 300
}: UseInfiniteScrollOptions) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - threshold
      ) {
        if (hasNextPage && !isLoading && !isFetching) {
          setIsFetching(true);
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isLoading, isFetching, fetchNextPage, threshold]);

  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false);
    }
  }, [isLoading]);

  return { isFetching };
}