'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateItem } from '@/hooks/useItems';
import { CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
}

const initialFormData: FormData = {
  title: '',
  description: '',
  imageUrl: '',
  category: '',
  tags: [],
};

export default function CreatePage() {
  const router = useRouter();
  const { createItem, isCreating } = useCreateItem();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddTag = () => {
    processTagInput();
  };

  const processTagInput = () => {
    const input = tagInput.trim();
    if (!input) return;

    // Split by comma and process each tag
    const newTags = input
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag && !formData.tags.includes(tag))
      .slice(0, 10 - formData.tags.length); // Respect the 10 tag limit

    if (newTags.length > 0) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, ...newTags]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processTagInput();
    }
  };

  const handleTagInputBlur = () => {
    processTagInput();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await createItem({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim(),
        category: formData.category,
        tags: formData.tags,
      });

      // Redirect to item detail page on success with new flag
      if (result.success && result.data?.id) {
        router.push(`/item/${result.data.id}?new=true`);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to create item:', error);
      // You could add error handling here (e.g., show toast notification)
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Create New Item</h1>
              <p className="text-sm text-muted-foreground">Share your amazing work with the community</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Give your creation an amazing title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={cn(errors.title && "border-destructive")}
                maxLength={100}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Tell us about your creation, inspiration, or technique..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                maxLength={500}
              />
              <div className="mt-1 text-xs text-muted-foreground text-right">
                {formData.description.length}/500
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-foreground mb-2">
                Image URL *
              </label>
              <div className="space-y-2">
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/your-image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  className={cn(errors.imageUrl && "border-destructive")}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-destructive">{errors.imageUrl}</p>
                )}
                
                {/* Image Preview */}
                {formData.imageUrl && isValidUrl(formData.imageUrl) && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <div className="relative aspect-video max-w-md bg-muted rounded-lg overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => {
                          setErrors(prev => ({ 
                            ...prev, 
                            imageUrl: 'Unable to load image from this URL' 
                          }));
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  "[&>option]:!bg-gray-900 [&>option]:!text-white dark:[&>option]:!bg-gray-900 dark:[&>option]:!text-white",
                  errors.category && "border-destructive"
                )}
                style={{
                  colorScheme: 'dark'
                }}
              >
                <option value="" style={{ backgroundColor: '#111827', color: 'white' }}>Select a category...</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category} style={{ backgroundColor: '#111827', color: 'white' }}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
                Tags
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    id="tags"
                    type="text"
                    placeholder="Enter tags separated by commas (e.g., nature, art, digital)..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    onBlur={handleTagInputBlur}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || formData.tags.length >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTag(tag)}
                          className="h-4 w-4 ml-2 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Add up to 10 tags to help others discover your work. Press Enter to add.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6">
              <Link href="/">
                <Button variant="outline">Cancel</Button>
              </Link>
              
              <Button
                type="submit"
                disabled={isCreating}
                className="min-w-[120px]"
              >
                {isCreating ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Create Item
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}