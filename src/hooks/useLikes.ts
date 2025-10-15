import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const likeFetcher = async (url: string, { arg }: { arg: { itemId: string } }) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
  return response.json();
};

export function useLikes(itemId: string | null) {
  const { data, error, mutate } = useSWR(
    itemId ? `/api/likes?itemId=${itemId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const { trigger, isMutating } = useSWRMutation('/api/likes', likeFetcher);

  const toggleLike = async () => {
    if (!itemId) return;

    try {
      const result = await trigger({ itemId });
      if (result.success) {
        // Optimistically update the cache
        mutate({
          success: true,
          data: result.data
        }, false);
        return result.data;
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  };

  return {
    isLiked: data?.data?.isLiked || false,
    totalLikes: data?.data?.totalLikes || 0,
    toggleLike,
    isToggling: isMutating,
    isLoading: !error && !data
  };
}