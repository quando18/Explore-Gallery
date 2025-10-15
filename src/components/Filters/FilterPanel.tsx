'use client';

import { useState } from 'react';
import { ChevronDown, X, SlidersHorizontal, TrendingUp, Clock, Heart, Eye, Sparkles, Camera, Palette, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, SearchParams } from '@/types';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  searchParams: SearchParams;
  onFiltersChange: (params: Partial<SearchParams>) => void;
  className?: string;
}

export function FilterPanel({ searchParams, onFiltersChange, className }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.tags || []);

  const sortOptions = [
    { value: 'created', label: 'Latest', icon: Clock, color: 'from-blue-500 to-cyan-500', description: 'Recently uploaded' },
    { value: 'trending', label: 'Trending', icon: TrendingUp, color: 'from-orange-500 to-red-500', description: 'Hot right now' },
    { value: 'likes', label: 'Most Liked', icon: Heart, color: 'from-pink-500 to-rose-500', description: 'Community favorites' },
    { value: 'views', label: 'Most Viewed', icon: Eye, color: 'from-purple-500 to-indigo-500', description: 'Popular picks' },
  ];

  const categoryIcons: Record<string, React.ComponentType> = {
    nature: Camera,
    abstract: Palette,
    ui: Monitor,
    photography: Camera,
    design: Palette,
    art: Sparkles,
    technology: Monitor,
  };

  const categoryOptions = [
    { 
      value: '', 
      label: 'All Categories', 
      icon: Sparkles, 
      color: 'from-purple-500 to-indigo-500', 
      description: 'Browse everything' 
    },
    ...CATEGORIES.slice(0, 7).map((category) => {
      const categoryColors: Record<string, string> = {
        nature: 'from-green-500 to-emerald-500',
        abstract: 'from-purple-500 to-violet-500',
        ui: 'from-blue-500 to-indigo-500',
        photography: 'from-amber-500 to-orange-500',
        design: 'from-pink-500 to-rose-500',
        art: 'from-cyan-500 to-teal-500',
        technology: 'from-slate-500 to-gray-600'
      };
      
      const categoryDescriptions: Record<string, string> = {
        nature: 'Landscapes & wildlife',
        abstract: 'Creative & artistic',
        ui: 'Interface designs',
        photography: 'Professional photos',
        design: 'Visual creations',
        art: 'Artistic works',
        technology: 'Tech & digital'
      };

      return {
        value: category,
        label: category,
        icon: categoryIcons[category] || Camera,
        color: categoryColors[category] || 'from-gray-500 to-slate-500',
        description: categoryDescriptions[category] || 'Discover more'
      };
    })
  ];

  const popularTags = [
    { name: 'nature', count: 245, color: 'from-green-500 to-emerald-500' },
    { name: 'abstract', count: 189, color: 'from-purple-500 to-violet-500' },
    { name: 'ui', count: 156, color: 'from-blue-500 to-indigo-500' },
    { name: 'photography', count: 312, color: 'from-amber-500 to-orange-500' },
    { name: 'design', count: 203, color: 'from-pink-500 to-rose-500' },
    { name: 'art', count: 178, color: 'from-cyan-500 to-teal-500' },
    { name: 'digital', count: 134, color: 'from-indigo-500 to-purple-500' },
    { name: 'creative', count: 167, color: 'from-rose-500 to-pink-500' }
  ];

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ 
      category: category === searchParams.category ? '' : category,
      page: 1 
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => {
    onFiltersChange({ 
      sortBy: sortBy as 'created' | 'trending' | 'likes' | 'views',
      sortOrder,
      page: 1 
    });
  };

  const handleTagToggle = (tagName: string) => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    
    setSelectedTags(newTags);
    onFiltersChange({ 
      tags: newTags.length > 0 ? newTags : undefined,
      page: 1 
    });
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    onFiltersChange({
      category: '',
      tags: undefined,
      sortBy: 'created',
      sortOrder: 'desc',
      page: 1
    });
  };

  const hasActiveFilters = searchParams.category || selectedTags.length > 0 || 
    (searchParams.sortBy && searchParams.sortBy !== 'created');

  return (
    <div className={cn(
      "relative bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden",
      "shadow-lg shadow-black/5",
      className
    )}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-xl bg-primary/10 mr-3">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Discover</h3>
              <p className="text-sm text-muted-foreground">Find your perfect match</p>
            </div>
            {hasActiveFilters && (
              <div className="ml-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  {selectedTags.length + (searchParams.category ? 1 : 0)} active
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-9 text-xs hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-9 w-9 lg:hidden hover:bg-primary/10 transition-all duration-200"
              aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
            >
              <ChevronDown className={cn(
                "h-4 w-4 transition-all duration-300",
                isExpanded && "rotate-180"
              )} />
            </Button>
          </div>
        </div>

        {/* Filters Content */}
        <div className={cn(
          "space-y-8 transition-all duration-300",
          "lg:block", // Always visible on desktop
          !isExpanded && "hidden lg:block" // Hidden on mobile when collapsed
        )}>
          {/* Sort Options */}
          <div>
            <div className="flex items-center mb-4">
              <TrendingUp className="h-4 w-4 text-primary mr-2" />
              <h4 className="font-semibold text-foreground">Sort & Order</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {sortOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = searchParams.sortBy === option.value;
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      "group relative cursor-pointer rounded-xl p-4 transition-all duration-200",
                      "border border-border/50 hover:border-primary/30",
                      "hover:shadow-md hover:shadow-primary/5",
                      isActive 
                        ? "bg-gradient-to-r " + option.color + " text-white border-transparent shadow-lg"
                        : "bg-card/50 hover:bg-card/80"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isActive ? "bg-white/20" : "bg-primary/10"
                        )}>
                          <IconComponent className={cn(
                            "h-4 w-4",
                            isActive ? "text-white" : "text-primary"
                          )} />
                        </div>
                        <div>
                          <div className={cn(
                            "font-medium",
                            isActive ? "text-white" : "text-foreground"
                          )}>
                            {option.label}
                          </div>
                          <div className={cn(
                            "text-xs",
                            isActive ? "text-white/80" : "text-muted-foreground"
                          )}>
                            {option.description}
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center mb-4">
              <Palette className="h-4 w-4 text-primary mr-2" />
              <h4 className="font-semibold text-foreground">Categories</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {categoryOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = searchParams.category === option.value;
                return (
                  <div
                    key={option.value}
                    onClick={() => handleCategoryChange(option.value)}
                    className={cn(
                      "group relative cursor-pointer rounded-xl p-4 transition-all duration-200",
                      "border border-border/50 hover:border-primary/30",
                      "hover:shadow-md hover:shadow-primary/5",
                      isActive 
                        ? "bg-gradient-to-r " + option.color + " text-white border-transparent shadow-lg"
                        : "bg-card/50 hover:bg-card/80"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isActive ? "bg-white/20" : "bg-primary/10"
                        )}>
                          <IconComponent className={cn(
                            "h-4 w-4",
                            isActive ? "text-white" : "text-primary"
                          )} />
                        </div>
                        <div>
                          <div className={cn(
                            "font-medium capitalize",
                            isActive ? "text-white" : "text-foreground"
                          )}>
                            {option.label}
                          </div>
                          <div className={cn(
                            "text-xs",
                            isActive ? "text-white/80" : "text-muted-foreground"
                          )}>
                            {option.description}
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <h4 className="font-semibold text-foreground">Popular Tags</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {popularTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.name}
                    onClick={() => handleTagToggle(tag.name)}
                    className={cn(
                      "group relative inline-flex items-center px-4 py-2 rounded-full transition-all duration-200",
                      "border border-border/30 hover:border-transparent hover:shadow-lg",
                      "font-medium text-sm",
                      isSelected
                        ? `bg-gradient-to-r ${tag.color} text-white border-transparent shadow-lg scale-105`
                        : "bg-card/70 text-foreground hover:scale-105"
                    )}
                  >
                    <span className="mr-2">#</span>
                    <span>{tag.name}</span>
                    <span className={cn(
                      "ml-2 px-1.5 py-0.5 rounded text-xs",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary"
                    )}>
                      {tag.count}
                    </span>
                    {isSelected && (
                      <X className="ml-2 h-3 w-3 text-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="relative rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 p-4 border border-primary/20">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-medium text-sm text-foreground">Active Filters</span>
              </div>
              <div className="space-y-2 text-sm">
                {searchParams.category && (
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium text-primary capitalize">{searchParams.category}</span>
                  </div>
                )}
                {selectedTags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map(tag => (
                        <span key={tag} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {searchParams.sortBy && searchParams.sortBy !== 'created' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Sort:</span>
                    <span className="font-medium text-primary">
                      {sortOptions.find(opt => opt.value === searchParams.sortBy)?.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}