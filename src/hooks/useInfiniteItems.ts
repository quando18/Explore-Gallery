import { useState, useEffect, useCallback, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { PaginatedResponse, GalleryItem, SearchParams } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useInfiniteItems(params: SearchParams = {}, forceRefresh?: boolean) {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Create search key for resetting
  const searchKey = useMemo(() => {
    return `${params.query || ''}_${params.category || ''}_${(params.tags || []).join(',')}_${params.sortBy || ''}_${params.sortOrder || ''}`;
  }, [params]);

  // Build query string
  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    Object.entries({ ...params, page, limit: 12 }).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          qs.append(key, value.join(','));
        } else {
          qs.append(key, String(value));
        }
      }
    });
    return qs.toString();
  }, [params, page]);

  const url = `/api/items?${queryString}`;
  
  const { data, error, isLoading } = useSWR<PaginatedResponse<GalleryItem>>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  // Force refresh when forceRefresh is true
  useEffect(() => {
    if (forceRefresh) {
      setPage(1);
      setAllItems([]);
      // Force revalidate the cache for the current page
      const refreshUrl = `/api/items?${new URLSearchParams({
        ...params as any,
        page: '1',
        limit: '12'
      }).toString()}`;
      mutate(refreshUrl);
    }
  }, [forceRefresh, params]);

  // Reset when search parameters change
  useEffect(() => {
    setPage(1);
    setAllItems([]);
  }, [searchKey]);

  // Update allItems when new data comes in
  useEffect(() => {
    if (!data?.data) return;

    setAllItems(prevItems => {
      if (page === 1) {
        return data.data;
      } else {
        // Append new items, avoiding duplicates
        const existingIds = new Set(prevItems.map(item => item.id));
        const newItems = data.data.filter(item => !existingIds.has(item.id));
        return [...prevItems, ...newItems];
      }
    });
    
    setIsLoadingMore(false);
  }, [data, page]);

  const loadMore = useCallback(() => {
    if (data?.pagination?.hasNext && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [data?.pagination?.hasNext, isLoading, isLoadingMore]);

  return {
    items: allItems,
    hasNextPage: data?.pagination?.hasNext || false,
    isLoading: isLoading && page === 1, // Only show loading for initial load
    isLoadingMore,
    isError: error,
    loadMore,
    totalCount: data?.pagination?.total || 0,
  };
}