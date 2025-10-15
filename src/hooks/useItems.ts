import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { PaginatedResponse, GalleryItem, SearchParams, ApiResponse } from '@/types';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Post fetcher for mutations
const postFetcher = async (url: string, { arg }: { arg: Record<string, unknown> }) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
  return response.json();
};

export function useItems(params: SearchParams = {}) {
  const queryString = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        queryString.append(key, value.join(','));
      } else {
        queryString.append(key, String(value));
      }
    }
  });

  const url = `/api/items?${queryString.toString()}`;
  
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<GalleryItem>>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
    }
  );

  return {
    data: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate
  };
}

export function useItem(id: string | null) {
  const { data, error, isLoading } = useSWR<ApiResponse<GalleryItem>>(
    id ? `/api/items/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.data,
    isLoading,
    isError: error
  };
}

export function useCreateItem() {
  const { trigger, isMutating } = useSWRMutation('/api/items', postFetcher);

  const createItem = async (itemData: {
    title: string;
    description?: string;
    imageUrl: string;
    tags: string[];
    category: string;
  }) => {
    try {
      const result = await trigger(itemData);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'Failed to create item');
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    createItem,
    isCreating: isMutating
  };
}

export function useSearchSuggestions() {
  const { data } = useSWR('/api/search?type=suggestions', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    tags: data?.data?.tags || [],
    titles: data?.data?.titles || [],
    categories: data?.data?.categories || []
  };
}

export function useAutocomplete(query: string) {
  const { data, isLoading } = useSWR(
    query.length >= 2 ? `/api/search?type=autocomplete&query=${encodeURIComponent(query)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300,
    }
  );

  return {
    suggestions: data?.data || [],
    isLoading
  };
}