
export interface StoreData {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  estimatedTime: string;
  address: string;
  category: string;
}

export type CategoryData = {
  name: string;
  description: string;
  icon: string;
};

export const categories: {[key: string]: CategoryData} = {
  'mini-mart': {
    name: 'Mini Mart',
    description: 'Convenience stores for your everyday needs',
    icon: '🏪'
  },
  'hardware': {
    name: 'Hardware Store',
    description: 'Tools and building materials',
    icon: '🔨'
  },
  'supermarket': {
    name: 'Supermarket',
    description: 'Groceries and household items',
    icon: '🛒'
  },
  'wholesale': {
    name: 'Wholesale',
    description: 'Bulk purchases at discounted prices',
    icon: '📦'
  },
  'pharmacy': {
    name: 'Pharmacy',
    description: 'Medicines and health products',
    icon: '💊'
  },
  'meat': {
    name: 'Meat Market',
    description: 'Fresh meat and poultry',
    icon: '🥩'
  },
  'water': {
    name: 'Water Filtration',
    description: 'Water purification and delivery',
    icon: '💧'
  },
  'restaurant': {
    name: 'Restaurant',
    description: 'Dine-in and takeout meals',
    icon: '🍽️'
  },
  'fastfood': {
    name: 'Fast Food',
    description: 'Quick and convenient meals',
    icon: '🍔'
  },
  'billpay': {
    name: 'Bill Pay',
    description: 'Pay your bills hassle-free',
    icon: '📄'
  }
};

export const mockStores: { [key: string]: StoreData } = {
  'store-1': {
    id: 'store-1',
    name: 'Quick Stop Mini Mart',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    distance: '1.2 km',
    estimatedTime: '15-20 min',
    address: '123 Main St, Kingston',
    category: 'mini-mart'
  },
  'store-4': {
    id: 'store-4',
    name: 'FreshMart Supermarket',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    distance: '2.3 km',
    estimatedTime: '20-30 min',
    address: '500 Market Blvd, Kingston',
    category: 'supermarket'
  },
  'store-6': {
    id: 'store-6',
    name: 'Island Pharmacy',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    distance: '1.7 km',
    estimatedTime: '15-25 min',
    address: '33 Health Rd, Kingston',
    category: 'pharmacy'
  },
  'store-8': {
    id: 'store-8',
    name: 'Island Flavors Restaurant',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    distance: '1.9 km',
    estimatedTime: '20-30 min',
    address: '55 Food St, Kingston',
    category: 'restaurant'
  }
};

// Create stores for all categories
Object.keys(categories).forEach(categoryId => {
  const storeId = `store-${categoryId}-1`;
  if (!mockStores[storeId]) {
    mockStores[storeId] = {
      id: storeId,
      name: `${categories[categoryId as keyof typeof categories].name} Store`,
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      distance: '1.2 km',
      estimatedTime: '15-20 min',
      address: '123 Main St, Kingston',
      category: categoryId
    };
  }
});

export const getStoreById = (storeId: string): StoreData | undefined => {
  return mockStores[storeId];
};

export const getCategoryById = (categoryId: string): CategoryData | undefined => {
  return categories[categoryId];
};
