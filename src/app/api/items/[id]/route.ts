import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, GalleryItem } from '@/types';
import { getItemById, incrementViews } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  // Find item by ID
  const item = getItemById(id);

  if (!item) {
    return NextResponse.json(
      { success: false, message: 'Item not found' },
      { status: 404 }
    );
  }

  // Increment view count (in real app, this would be in database)
  const updatedItem = incrementViews(id);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const response: ApiResponse<GalleryItem> = {
    success: true,
    data: updatedItem || item
  };

  return NextResponse.json(response);
}