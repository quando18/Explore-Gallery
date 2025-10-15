'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLikes } from '@/hooks/useLikes';
import { GalleryItem as GalleryItemType } from '@/types';
import { cn } from '@/lib/utils';

interface GalleryItemProps {
  item: GalleryItemType;
  className?: string;
  priority?: boolean;
}

export function GalleryItem({ item, className, priority = false }: GalleryItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isLiked, totalLikes, toggleLike, isToggling } = useLikes(item.id);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await toggleLike();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <div className={cn(
      "group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300",
      className
    )}>
      {/* Image Container */}
      <Link href={`/item/${item.id}`} className="block relative">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {!imageError ? (
            <Image
              src={item.thumbnailUrl || item.imageUrl}
              alt={item.title}
              fill
              className={cn(
                "object-cover transition-all duration-300 group-hover:scale-105",
                !imageLoaded && "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.warn('Image load failed:', item.id, item.imageUrl);
                setImageError(true);
              }}
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-background rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <p className="text-sm">Image not available</p>
              </div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-background/90 text-foreground text-xs px-2 py-1 rounded-full font-medium">
              {item.category}
            </span>
          </div>
          
          {/* Like Button */}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLikeClick}
              disabled={isToggling}
              className={cn(
                "h-8 w-8 bg-background/90 hover:bg-background transition-colors",
                isLiked && "text-red-500 hover:text-red-600"
              )}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isLiked && "fill-current"
                )} 
              />
            </Button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/item/${item.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors mb-2">
            {item.title}
          </h3>
        </Link>

        {/* Author */}
        <div className="flex items-center mb-3">
          <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2 bg-muted">
            {item.author.avatar ? (
              <Image
                src={item.author.avatar}
                alt={item.author.name}
                fill
                className="object-cover"
                sizes="24px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground truncate">
            {item.author.name}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Heart className={cn(
                "h-3 w-3 mr-1",
                isLiked && "text-red-500 fill-current"
              )} />
              <span>{totalLikes || item.likes}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{item.views.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex items-center space-x-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag}
                className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}