import { GalleryItem } from '@/types';

export const mockItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Sunset Over Mountains',
    description: 'A breathtaking view of the sunset over the mountain range, captured during golden hour.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    author: {
      id: 'user1',
      name: 'Alex Photography',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    tags: ['nature', 'sunset', 'mountains', 'landscape'],
    category: 'Photography',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    likes: 245,
    views: 1250,
  },
  {
    id: '2',
    title: 'Modern UI Design',
    description: 'Clean and minimal user interface design for a mobile banking app.',
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
    author: {
      id: 'user2',
      name: 'Sarah Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    tags: ['ui', 'mobile', 'banking', 'design'],
    category: 'UI/UX Design',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    likes: 189,
    views: 890,
  },
  {
    id: '3',
    title: 'Abstract Digital Art',
    description: 'Colorful abstract composition created with digital painting techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=300&h=200&fit=crop',
    author: {
      id: 'user3',
      name: 'Mike Artist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    tags: ['abstract', 'digital', 'colorful', 'art'],
    category: 'Digital Art',
    createdAt: '2024-01-13T10:45:00Z',
    updatedAt: '2024-01-13T10:45:00Z',
    likes: 156,
    views: 670,
  },
  {
    id: '4',
    title: 'City Architecture',
    description: 'Modern skyscrapers reaching towards the sky in downtown area.',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
    author: {
      id: 'user4',
      name: 'Emma Architecture',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    tags: ['architecture', 'city', 'buildings', 'urban'],
    category: 'Architecture',
    createdAt: '2024-01-12T16:15:00Z',
    updatedAt: '2024-01-12T16:15:00Z',
    likes: 278,
    views: 1450,
  },
  {
    id: '5',
    title: 'Fashion Portrait',
    description: 'Elegant fashion photography with dramatic lighting and styling.',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=200&fit=crop',
    author: {
      id: 'user5',
      name: 'James Fashion',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    tags: ['fashion', 'portrait', 'model', 'photography'],
    category: 'Fashion',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z',
    likes: 312,
    views: 1680,
  }
];

// Generate more items for pagination testing
const artworkTitles = [
  'Ethereal Dreams', 'Urban Symphony', 'Digital Horizon', 'Mystic Waters', 'Golden Reflection',
  'Neon Nights', 'Vintage Memories', 'Crystal Vision', 'Ocean Breeze', 'Mountain Echo',
  'Starlight Serenade', 'Forest Whispers', 'Desert Mirage', 'City Pulse', 'Lunar Dance',
  'Rainbow Cascade', 'Thunder Storm', 'Silent Valley', 'Burning Sky', 'Frozen Time',
  'Electric Soul', 'Velvet Shadows', 'Crimson Dawn', 'Azure Dreams', 'Emerald Glow',
  'Silver Moon', 'Copper Sunset', 'Pearl Harbor', 'Diamond Rain', 'Ruby Fire',
  'Sapphire Sea', 'Amethyst Cloud', 'Jade Garden', 'Onyx Night', 'Opal Light',
  'Marble Statue', 'Bronze Age', 'Iron Will', 'Steel Frame', 'Gold Rush',
  'Platinum Sky', 'Titanium Edge', 'Carbon Fiber', 'Quantum Leap', 'Cosmic Ray'
];

const artistNames = [
  'Elena Rodriguez', 'Marcus Chen', 'Sophie Turner', 'David Kim', 'Isabella Moore',
  'Ryan Thompson', 'Aria Patel', 'Lucas Anderson', 'Maya Williams', 'Noah Davis',
  'Chloe Johnson', 'Ethan Brown', 'Zoe Martinez', 'Owen Wilson', 'Lily Garcia',
  'Jack Miller', 'Emma Taylor', 'Leo Thomas', 'Grace Lee', 'Max Jackson',
  'Ava White', 'Henry Harris', 'Mia Clark', 'Sam Lewis', 'Nora Walker',
  'Jake Hall', 'Ivy Allen', 'Cole Young', 'Ruby King', 'Finn Wright',
  'Luna Lopez', 'Alex Hill', 'Sage Green', 'River Adams', 'Sky Baker',
  'Ocean Nelson', 'Storm Carter', 'Rain Mitchell', 'Star Perez', 'Dawn Roberts',
  'Phoenix Turner', 'Nova Phillips', 'Atlas Campbell', 'Luna Parker', 'Orion Evans'
];

const descriptions = [
  'A stunning masterpiece that captures the essence of modern creativity.',
  'Beautifully crafted with attention to every detail and vibrant colors.',
  'An inspiring work that blends traditional techniques with contemporary vision.',
  'A captivating piece that tells a story through visual excellence.',
  'Expertly designed with perfect composition and striking visual impact.',
  'A remarkable creation that showcases innovative artistic expression.',
  'Thoughtfully composed with beautiful lighting and dynamic elements.',
  'An extraordinary work that demonstrates exceptional creative skill.',
  'Masterfully executed with incredible depth and emotional resonance.',
  'A breathtaking piece that combines technical expertise with artistic vision.'
];

for (let i = 6; i <= 50; i++) {
  const categories = ['Photography', 'Digital Art', 'UI/UX Design', 'Illustration', 'Architecture', 'Fashion', 'Nature', 'Abstract'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomTitle = artworkTitles[Math.floor(Math.random() * artworkTitles.length)];
  const randomArtist = artistNames[Math.floor(Math.random() * artistNames.length)];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  mockItems.push({
    id: i.toString(),
    title: randomTitle,
    description: randomDescription,
    imageUrl: `https://picsum.photos/id/${i + 100}/800/600`,
    thumbnailUrl: `https://picsum.photos/id/${i + 100}/300/200`,
    author: {
      id: `user${i}`,
      name: randomArtist,
      avatar: `https://i.pravatar.cc/100?img=${i}`
    },
    tags: ['creative', 'art', 'design', `tag${i}`],
    category: randomCategory,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 2000),
  });
}