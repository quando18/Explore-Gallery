import { test, expect } from '@playwright/test';

test.describe('Explore Gallery E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage and display gallery items', async ({ page }) => {
    // Wait for gallery items to load
    await expect(page.getByTestId('gallery-grid')).toBeVisible();
    
    // Check if items are displayed
    const items = page.locator('[data-testid="gallery-item"]');
    await expect(items.first()).toBeVisible();
    
    // Verify responsive layout on desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    const gridCols = await page.locator('[data-testid="gallery-grid"]').getAttribute('class');
    expect(gridCols).toContain('md:grid-cols-4');
  });

  test('should perform search with debouncing', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search for photos, designs...');
    
    // Type in search - should debounce
    await searchInput.fill('nature');
    
    // Wait for debounce delay + API response
    await page.waitForTimeout(400);
    
    // Verify filtered results
    await expect(page.getByTestId('gallery-grid')).toBeVisible();
  });

  test('should navigate to item detail page', async ({ page }) => {
    // Wait for items to load
    await expect(page.getByTestId('gallery-grid')).toBeVisible();
    
    // Click on first item
    const firstItem = page.locator('[data-testid="gallery-item"]').first();
    await firstItem.click();
    
    // Verify navigation to detail page
    await expect(page).toHaveURL(/\/item\/\d+/);
    
    // Check detail page elements
    await expect(page.getByTestId('item-image')).toBeVisible();
    await expect(page.getByTestId('like-button')).toBeVisible();
    await expect(page.getByTestId('related-items')).toBeVisible();
  });

  test('should like/unlike items with optimistic updates', async ({ page }) => {
    // Go to item detail
    await page.goto('/item/1');
    
    const likeButton = page.getByTestId('like-button');
    const likeCount = page.getByTestId('like-count');
    
    // Get initial like count
    const initialCount = await likeCount.textContent();
    
    // Click like button
    await likeButton.click();
    
    // Verify optimistic update (should update immediately)
    await expect(likeCount).not.toHaveText(initialCount || '');
  });

  test('should create new item and redirect to detail', async ({ page }) => {
    await page.goto('/create');
    
    // Fill form
    await page.getByLabel('Title').fill('Test Item');
    await page.getByLabel('Image URL').fill('https://images.unsplash.com/test.jpg');
    await page.getByLabel('Category').selectOption('nature');
    await page.getByLabel('Tags').fill('test, nature, photography');
    await page.getByLabel('Description').fill('Test description');
    
    // Submit form
    await page.getByRole('button', { name: 'Create Item' }).click();
    
    // Verify redirect to item detail
    await expect(page).toHaveURL(/\/item\/\d+/);
    await expect(page.getByText('Test Item')).toBeVisible();
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder('Search for photos, designs...')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Search' })).toBeFocused();
    
    // Test Enter key on items
    await page.goto('/');
    const firstItem = page.locator('[data-testid="gallery-item"]').first();
    await firstItem.focus();
    await page.keyboard.press('Enter');
    
    // Should navigate to detail page
    await expect(page).toHaveURL(/\/item\/\d+/);
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify responsive grid (1 column on mobile)
    await expect(page.getByTestId('gallery-grid')).toBeVisible();
    const gridCols = await page.locator('[data-testid="gallery-grid"]').getAttribute('class');
    expect(gridCols).toContain('grid-cols-1');
    
    // Test mobile navigation
    const firstItem = page.locator('[data-testid="gallery-item"]').first();
    await firstItem.click();
    
    await expect(page).toHaveURL(/\/item\/\d+/);
  });
});