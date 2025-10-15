import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, GalleryItem } from '@/types';
import { getItemByIdFile, incrementViewsFile } from '@/lib/fileStorage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Find item by ID
  const item = getItemByIdFile(id);

  if (!item) {
    return NextResponse.json(
      { success: false, message: 'Item not found' },
      { status: 404 }
    );
  }

  // Increment view count (in real app, this would be in database)
  incrementViewsFile(id);

  // Get updated item
  const updatedItem = getItemByIdFile(id) || item;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const response: ApiResponse<GalleryItem> = {
    success: true,
    data: updatedItem
  };

  return NextResponse.json(response);
}