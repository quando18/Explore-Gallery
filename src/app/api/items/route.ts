import { NextRequest, NextResponse } from 'next/server';
import { PaginatedResponse, GalleryItem, SearchParams } from '@/types';
import { getAllItems, addItem } from '@/lib/storage';
import { generateThumbnailUrl, getFullImageUrl } from '@/lib/imageUtils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse query parameters
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const tagsParam = searchParams.get('tags') || '';
  const sortBy = (searchParams.get('sortBy') || 'created') as 'created' | 'trending' | 'likes' | 'views';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  let filteredItems = [...getAllItems()];

  // Filter by search query
  if (query) {
    const searchQuery = query.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery) ||
      item.description?.toLowerCase().includes(searchQuery) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery)) ||
      item.author.name.toLowerCase().includes(searchQuery)
    );
  }

  // Filter by category
  if (category && category !== 'all') {
    filteredItems = filteredItems.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by tags
  if (tagsParam) {
    const tags = tagsParam.split(',').map(tag => tag.trim().toLowerCase());
    filteredItems = filteredItems.filter(item =>
      tags.some((tag: string) => item.tags.some((itemTag: string) => itemTag.toLowerCase().includes(tag)))
    );
  }

  // Sort items
  filteredItems.sort((a, b) => {
    let aValue: number | string, bValue: number | string;
    
    switch (sortBy) {
      case 'likes':
        aValue = a.likes;
        bValue = b.likes;
        break;
      case 'views':
        aValue = a.views;
        bValue = b.views;
        break;
      case 'trending':
        // Trending score: combination of likes, views, and recency
        const daysSinceCreatedA = (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        const daysSinceCreatedB = (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        aValue = (a.likes * 2 + a.views) / (1 + daysSinceCreatedA * 0.1);
        bValue = (b.likes * 2 + b.views) / (1 + daysSinceCreatedB * 0.1);
        break;
      case 'created':
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const total = filteredItems.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const response: PaginatedResponse<GalleryItem> = {
    data: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, tags, category } = body;

    // Validate required fields
    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new item
    const allItems = getAllItems();
    // Generate unique ID to avoid conflicts
    const maxId = Math.max(...allItems.map(item => parseInt(item.id) || 0));
    const newItem: GalleryItem = {
      id: (maxId + 1).toString(),
      title,
      description: description || '',
      imageUrl: getFullImageUrl(imageUrl), // Ensure high-quality for detail view
      thumbnailUrl: generateThumbnailUrl(imageUrl), // Generate optimized thumbnail
      author: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://i.pravatar.cc/100?img=1'
      },
      tags: tags || [],
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0,
    };

    // Add to items array
    addItem(newItem);

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Item created successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}