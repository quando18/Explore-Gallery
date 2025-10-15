import { NextRequest, NextResponse } from 'next/server';
import { mockItems } from '@/lib/mockData';
import { LikeResponse } from '@/types';

// In-memory storage for likes (in real app, this would be in database)
const userLikes = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Find item
    const item = mockItems.find(item => item.id === itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    // Toggle like status
    const isCurrentlyLiked = userLikes.has(itemId);
    
    if (isCurrentlyLiked) {
      userLikes.delete(itemId);
      item.likes = Math.max(0, item.likes - 1);
    } else {
      userLikes.add(itemId);
      item.likes += 1;
    }

    const response: LikeResponse = {
      itemId,
      isLiked: !isCurrentlyLiked,
      totalLikes: item.likes
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const itemId = searchParams.get('itemId');

  if (!itemId) {
    return NextResponse.json(
      { success: false, message: 'Item ID is required' },
      { status: 400 }
    );
  }

  const isLiked = userLikes.has(itemId);
  const item = mockItems.find(item => item.id === itemId);
  
  return NextResponse.json({
    success: true,
    data: {
      itemId,
      isLiked,
      totalLikes: item?.likes || 0
    }
  });
}