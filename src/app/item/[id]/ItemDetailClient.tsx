'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Heart, Eye, User, Calendar, Tag, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useLikes } from '@/hooks/useLikes';
import { useRelatedItems } from '@/hooks/useRelatedItems';
import { GalleryItem } from '@/types';
import { cn } from '@/lib/utils';
import { getFullImageUrl } from '@/lib/imageUtils';

interface ItemDetailClientProps {
  initialItem: GalleryItem;
}

export function ItemDetailClient({ initialItem }: ItemDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [item, setItem] = useState(initialItem);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { isLiked, totalLikes, toggleLike, isToggling } = useLikes(item.id);
  const { relatedItems, isLoading: relatedLoading } = useRelatedItems(item.category, item.id, 6);
  
  // Check if this is a newly created item
  const isNewItem = searchParams.get('new') === 'true';

  const handleLikeClick = async () => {
    try {
      await toggleLike();
      // Update local item state with new like count
      setItem(prev => ({
        ...prev,
        likes: totalLikes
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleBackClick = () => {
    // If this is a newly created item, navigate back with refresh flag
    if (isNewItem) {
      router.push('/?refresh=true');
    } else {
      router.push('/');
    }
  };

  const handleDownload = async () => {
    try {
      const imageUrl = getFullImageUrl(item.imageUrl);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from title or use default
      const filename = item.title
        ? `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`
        : `image_${item.id}.jpg`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
      // Fallback: open in new tab
      window.open(getFullImageUrl(item.imageUrl), '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or share failed
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Button variant="ghost" size="icon" className="mr-4" onClick={handleBackClick}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold truncate">{item.title}</h1>
              <p className="text-sm text-muted-foreground">by {item.author.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <div className="relative bg-muted rounded-lg overflow-hidden">
              {!imageError ? (
                <div className="relative aspect-video">
                  <Image
                    src={getFullImageUrl(item.imageUrl)}
                    alt={item.title}
                    fill
                    className={cn(
                      "object-contain transition-opacity duration-300",
                      !imageLoaded && "opacity-0"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 bg-background rounded-full flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <p>Image not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <div className="flex items-center space-x-4">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  onClick={handleLikeClick}
                  disabled={isToggling}
                  className="flex items-center space-x-2"
                >
                  <Heart className={cn(
                    "h-4 w-4",
                    isLiked && "fill-current"
                  )} />
                  <span>{totalLikes || item.likes}</span>
                </Button>

                <div className="flex items-center text-muted-foreground">
                  <Eye className="h-4 w-4 mr-2" />
                  <span>{item.views.toLocaleString()} views</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Author Info */}
            <div className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                {item.author.avatar ? (
                  <Image
                    src={item.author.avatar}
                    alt={item.author.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.author.name}</h3>
                <p className="text-sm text-muted-foreground">Creator</p>
              </div>
              <Button variant="outline" size="sm">
                Follow
              </Button>
            </div>

            {/* Item Details */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                {item.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Published {formatDate(item.createdAt)}</span>
                </div>

                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {(totalLikes || item.likes).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {item.views.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* More from this category */}
      {relatedItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              More from {item.category}
            </h2>
            <p className="text-muted-foreground">
              Discover other amazing {item.category.toLowerCase()} items
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedItems.map((relatedItem) => (
              <Link 
                key={relatedItem.id}
                href={`/item/${relatedItem.id}`}
                className="group block"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                  <Image
                    src={relatedItem.thumbnailUrl || relatedItem.imageUrl}
                    alt={relatedItem.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {relatedItem.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    by {relatedItem.author.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {relatedLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square rounded-lg bg-muted" />
                  <div className="mt-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share this item"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Share URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={typeof window !== 'undefined' ? window.location.href : ''}
                readOnly
                className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.href : '')}
              >
                Copy
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Share this amazing {item.category.toLowerCase()} with your friends and community!
          </div>
        </div>
      </Modal>
    </div>
  );
}