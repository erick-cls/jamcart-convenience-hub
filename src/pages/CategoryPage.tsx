
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Star, Clock, ChevronLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ActionButton from '@/components/ui/ActionButton';
import { useAuth } from '@/context/AuthContext';

interface Store {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  estimatedTime: string;
  address: string;
}

// Mock category data
const categories = {
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

// Mock stores data
const mockStores: { [key: string]: Store[] } = {
  'mini-mart': [
    {
      id: 'store-1',
      name: 'Quick Stop Mini Mart',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      distance: '1.2 km',
      estimatedTime: '15-20 min',
      address: '123 Main St, Kingston'
    },
    {
      id: 'store-2',
      name: 'Corner Market',
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.2,
      distance: '0.8 km',
      estimatedTime: '10-15 min',
      address: '45 Park Ave, Kingston'
    },
    {
      id: 'store-3',
      name: 'Express Stop',
      image: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      distance: '1.5 km',
      estimatedTime: '15-25 min',
      address: '78 Queen St, Kingston'
    }
  ],
  'supermarket': [
    {
      id: 'store-4',
      name: 'FreshMart Supermarket',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      distance: '2.3 km',
      estimatedTime: '20-30 min',
      address: '500 Market Blvd, Kingston'
    },
    {
      id: 'store-5',
      name: 'Value Grocers',
      image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.3,
      distance: '3.1 km',
      estimatedTime: '25-35 min',
      address: '220 High St, Kingston'
    }
  ],
  'pharmacy': [
    {
      id: 'store-6',
      name: 'Island Pharmacy',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      distance: '1.7 km',
      estimatedTime: '15-25 min',
      address: '33 Health Rd, Kingston'
    },
    {
      id: 'store-7',
      name: 'Wellness Drugs',
      image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      distance: '2.2 km',
      estimatedTime: '20-30 min',
      address: '88 Medical Ave, Kingston'
    }
  ],
  'restaurant': [
    {
      id: 'store-8',
      name: 'Island Flavors Restaurant',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      distance: '1.9 km',
      estimatedTime: '20-30 min',
      address: '55 Food St, Kingston'
    },
    {
      id: 'store-9',
      name: 'Sea Breeze Dining',
      image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      distance: '2.5 km',
      estimatedTime: '25-35 min',
      address: '121 Ocean Rd, Kingston'
    }
  ]
};

// Create default stores for all categories
Object.keys(categories).forEach(key => {
  if (!mockStores[key]) {
    mockStores[key] = [
      {
        id: `store-${key}-1`,
        name: `${categories[key as keyof typeof categories].name} Store 1`,
        image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        rating: 4.5,
        distance: '1.2 km',
        estimatedTime: '15-20 min',
        address: '123 Main St, Kingston'
      },
      {
        id: `store-${key}-2`,
        name: `${categories[key as keyof typeof categories].name} Store 2`,
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        rating: 4.2,
        distance: '0.8 km',
        estimatedTime: '10-15 min',
        address: '45 Park Ave, Kingston'
      }
    ];
  }
});

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  
  useEffect(() => {
    if (!categoryId || !Object.keys(categories).includes(categoryId)) {
      navigate('/categories');
      return;
    }
    
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setStores(mockStores[categoryId] || []);
      setIsLoading(false);
    }, 800);
  }, [categoryId, navigate]);
  
  const category = categoryId ? categories[categoryId as keyof typeof categories] : null;
  
  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleStoreSelection = (storeId: string) => {
    navigate(`/order/${categoryId}/${storeId}`);
  };
  
  if (!category) return null;
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black">
        <section className="py-8 bg-black">
          <div className="app-container">
            <div className="flex items-center mb-6">
              <button
                className="p-2 rounded-full hover:bg-gray-200 mr-3"
                onClick={() => navigate('/categories')}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <span className="mr-3 text-4xl">{category.icon}</span>
                  {category.name}
                </h1>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jamcart-red/50"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
              </div>
              
              <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-50">
                <Filter className="h-5 w-5 text-gray-500" />
                <span>Filter</span>
              </button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                      <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                  <StoreCard key={store.id} store={store} onSelect={handleStoreSelection} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No Stores Found</h3>
                <p className="text-gray-600">
                  We couldn't find any stores matching "{searchTerm}".
                </p>
                {searchTerm && (
                  <button
                    className="mt-4 text-jamcart-red font-medium hover:underline"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

interface StoreCardProps {
  store: Store;
  onSelect: (id: string) => void;
}

const StoreCard = ({ store, onSelect }: StoreCardProps) => {
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48">
        <img 
          src={store.image} 
          alt={store.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-white rounded-full px-2 py-1 flex items-center text-xs font-medium shadow-sm">
          <Clock className="h-3 w-3 mr-1 text-jamcart-red" />
          {store.estimatedTime}
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{store.name}</h3>
          <div className="flex items-center bg-jamcart-yellow/10 text-yellow-700 px-2 py-1 rounded-md text-sm">
            <Star className="h-3.5 w-3.5 fill-yellow-500 stroke-yellow-500 mr-1" />
            {store.rating}
          </div>
        </div>
        
        <div className="flex items-start mb-3">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-gray-600 text-sm">{store.address}</p>
            <p className="text-gray-500 text-xs">{store.distance} away</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0 mt-auto">
        <ActionButton
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onSelect(store.id)}
        >
          Select Store
        </ActionButton>
      </div>
    </motion.div>
  );
};

export default CategoryPage;
