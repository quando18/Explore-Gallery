import useSWR from 'swr';
import { PaginatedResponse, GalleryItem } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRelatedItems(category: string, currentItemId: string, limit: number = 6) {
  const { data, error, isLoading } = useSWR<PaginatedResponse<GalleryItem>>(
    category ? `/api/items?category=${encodeURIComponent(category)}&limit=${limit}&sortBy=trending&sortOrder=desc` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  // Filter out current item from related items
  const relatedItems = data?.data?.filter(item => item.id !== currentItemId) || [];

  return {
    relatedItems: relatedItems.slice(0, limit), // Ensure we don't exceed limit after filtering
    isLoading,
    isError: error,
  };
}