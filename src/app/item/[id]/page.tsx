import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ItemDetailClient } from './ItemDetailClient';
import { GalleryItem, ApiResponse } from '@/types';

interface Props {
  params: { id: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/items/${id}`, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      return {
        title: 'Item Not Found - Explore Gallery',
      };
    }

    const data: ApiResponse<GalleryItem> = await response.json();
    const item = data.data;

    return {
      title: `${item.title} by ${item.author.name} - Explore Gallery`,
      description: item.description || `Discover ${item.title} and more amazing ${item.category.toLowerCase()} content on Explore Gallery.`,
      openGraph: {
        title: item.title,
        description: item.description || `Amazing ${item.category.toLowerCase()} by ${item.author.name}`,
        images: [
          {
            url: item.imageUrl,
            width: 800,
            height: 600,
            alt: item.title,
          },
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: item.title,
        description: item.description || `Amazing ${item.category.toLowerCase()} by ${item.author.name}`,
        images: [item.imageUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Item Not Found - Explore Gallery',
    };
  }
}

// Server-side data fetching
async function getItem(id: string): Promise<GalleryItem | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/items/${id}`, {
      cache: 'no-store', // Always fetch fresh data for view count
    });

    if (!response.ok) {
      return null;
    }

    const data: ApiResponse<GalleryItem> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  return <ItemDetailClient initialItem={item} />;
}