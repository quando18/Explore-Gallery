export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  sortBy?: 'created' | 'trending' | 'likes' | 'views';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateItemRequest {
  title: string;
  description?: string;
  imageUrl: string;
  tags: string[];
  category: string;
}

export interface LikeResponse {
  itemId: string;
  isLiked: boolean;
  totalLikes: number;
}

export const CATEGORIES = [
  'Photography',
  'Digital Art',
  'UI/UX Design',
  'Illustration',
  'Architecture',
  'Fashion',
  'Nature',
  'Abstract',
  'Others'
] as const;

export type Category = typeof CATEGORIES[number];