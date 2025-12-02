import { ProjectTemplate } from '@/types';

export const projectTemplates: ProjectTemplate[] = [
  {
    id: '2bhk-standard',
    name: '2BHK Standard',
    description: 'Standard 2 bedroom apartment with modern amenities',
    floors: 1,
    floorData: [
      { bedrooms: 2, bathrooms: 2, kitchens: 1, halls: 1 }
    ],
    area: 900,
    quality: 'standard'
  },
  {
    id: '3bhk-standard',
    name: '3BHK Standard',
    description: 'Comfortable 3 bedroom home for families',
    floors: 1,
    floorData: [
      { bedrooms: 3, bathrooms: 2, kitchens: 1, halls: 1 }
    ],
    area: 1200,
    quality: 'standard'
  },
  {
    id: '2bhk-premium',
    name: '2BHK Premium',
    description: 'Luxury 2 bedroom apartment with high-end finishes',
    floors: 1,
    floorData: [
      { bedrooms: 2, bathrooms: 2, kitchens: 1, halls: 1 }
    ],
    area: 1000,
    quality: 'premium'
  },
  {
    id: '3bhk-premium',
    name: '3BHK Premium',
    description: 'Premium 3 bedroom home with superior quality',
    floors: 1,
    floorData: [
      { bedrooms: 3, bathrooms: 3, kitchens: 1, halls: 1 }
    ],
    area: 1400,
    quality: 'premium'
  },
  {
    id: 'duplex-standard',
    name: 'Duplex Standard',
    description: 'Two-story home with standard specifications',
    floors: 2,
    floorData: [
      { bedrooms: 2, bathrooms: 2, kitchens: 1, halls: 1 },
      { bedrooms: 2, bathrooms: 1, kitchens: 0, halls: 1 }
    ],
    area: 1600,
    quality: 'standard'
  },
  {
    id: 'villa-basic',
    name: 'Villa Basic',
    description: 'Independent villa with basic amenities',
    floors: 1,
    floorData: [
      { bedrooms: 3, bathrooms: 3, kitchens: 1, halls: 2 }
    ],
    area: 2000,
    quality: 'basic'
  },
  {
    id: 'villa-premium',
    name: 'Villa Premium',
    description: 'Luxury independent villa with premium finishes',
    floors: 2,
    floorData: [
      { bedrooms: 4, bathrooms: 4, kitchens: 1, halls: 2 },
      { bedrooms: 2, bathrooms: 2, kitchens: 0, halls: 1 }
    ],
    area: 3000,
    quality: 'premium'
  },
  {
    id: 'studio-basic',
    name: 'Studio Basic',
    description: 'Compact studio apartment for singles',
    floors: 1,
    floorData: [
      { bedrooms: 1, bathrooms: 1, kitchens: 1, halls: 1 }
    ],
    area: 400,
    quality: 'basic'
  }
];

export const getTemplateById = (id: string): ProjectTemplate | undefined => {
  return projectTemplates.find(template => template.id === id);
};

export const getTemplatesByType = (type: '2bhk' | '3bhk' | 'duplex' | 'villa' | 'studio'): ProjectTemplate[] => {
  return projectTemplates.filter(template => template.id.includes(type));
};
