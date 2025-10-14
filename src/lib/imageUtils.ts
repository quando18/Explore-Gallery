/**
 * Utility functions for image URL handling
 */

/**
 * Generate thumbnail URL from original image URL
 * For Unsplash images, it modifies the parameters to create smaller thumbnails
 * For other images, it returns the original URL
 */
export function generateThumbnailUrl(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    
    // Handle Unsplash images
    if (url.hostname === 'images.unsplash.com') {
      // Set thumbnail parameters
      url.searchParams.set('w', '400');
      url.searchParams.set('h', '300');
      url.searchParams.set('fit', 'crop');
      return url.toString();
    }
    
    // Handle Pexels images
    if (url.hostname === 'images.pexels.com') {
      // Pexels auto-optimization, just return original
      return imageUrl;
    }
    
    // For other images, return as-is
    return imageUrl;
  } catch (error) {
    // If URL parsing fails, return original
    return imageUrl;
  }
}

/**
 * Get full resolution image URL
 * For Unsplash images, it ensures we get high-quality version
 */
export function getFullImageUrl(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    
    // Handle Unsplash images
    if (url.hostname === 'images.unsplash.com') {
      // Set high-quality parameters
      url.searchParams.set('w', '1200');
      url.searchParams.set('h', '800');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('q', '80'); // High quality
      return url.toString();
    }
    
    // For other images, return as-is
    return imageUrl;
  } catch (error) {
    // If URL parsing fails, return original
    return imageUrl;
  }
}

/**
 * Clean image URL by removing size parameters to get the base image
 */
export function getBaseImageUrl(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    
    // Handle Unsplash images - remove size parameters
    if (url.hostname === 'images.unsplash.com') {
      // Keep only the photo ID and essential parameters
      const photoId = url.pathname;
      return `https://images.unsplash.com${photoId}`;
    }
    
    // For other images, return as-is
    return imageUrl;
  } catch (error) {
    return imageUrl;
  }
}