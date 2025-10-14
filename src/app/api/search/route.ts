import { NextRequest, NextResponse } from 'next/server';
import { mockItems } from '@/lib/mockData';
import { CATEGORIES } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'suggestions';

  if (type === 'suggestions') {
    // Get popular search suggestions
    const popularTags = Array.from(
      new Set(mockItems.flatMap(item => item.tags))
    ).slice(0, 10);

    const popularTitles = mockItems
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(item => item.title);

    return NextResponse.json({
      success: true,
      data: {
        tags: popularTags,
        titles: popularTitles,
        categories: CATEGORIES
      }
    });
  }

  if (type === 'autocomplete') {
    const query = searchParams.get('query') || '';
    
    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const queryLower = query.toLowerCase();
    
    // Search in titles, tags, and author names
    const suggestions = new Set<string>();
    
    mockItems.forEach(item => {
      // Match titles
      if (item.title.toLowerCase().includes(queryLower)) {
        suggestions.add(item.title);
      }
      
      // Match tags
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
      
      // Match author names
      if (item.author.name.toLowerCase().includes(queryLower)) {
        suggestions.add(item.author.name);
      }
    });

    const suggestionArray = Array.from(suggestions).slice(0, 8);
    
    return NextResponse.json({
      success: true,
      data: suggestionArray
    });
  }

  return NextResponse.json(
    { success: false, message: 'Invalid search type' },
    { status: 400 }
  );
}