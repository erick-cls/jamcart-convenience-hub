
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { StoreCard } from '@/components/stores/StoreCard';
import { StoreSearch } from '@/components/stores/StoreSearch';
import { StoresLoading } from '@/components/stores/StoresLoading';
import { NoStoresFound } from '@/components/stores/NoStoresFound';
import { Store } from '@/types/store.types';
import { categories, mockStores } from '@/utils/order/mockStoreData';

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
    
    setIsLoading(true);
    // Simulate API call with timeout
    setTimeout(() => {
      // Filter stores from mockStores that match the current category
      const filteredStores = Object.values(mockStores).filter(
        store => store.category === categoryId
      );
      
      setStores(filteredStores);
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
      <div className="min-h-screen pt-20 bg-black">
        <section className="py-8 bg-black">
          <div className="app-container">
            <div className="flex items-center mb-6">
              <button
                className="p-2 rounded-full hover:bg-gray-800 mr-3 text-white"
                onClick={() => navigate('/categories')}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold flex items-center text-white">
                  <span className="mr-3 text-4xl flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: '#fdf7d5' }}>{category.icon}</span>
                  {category.name}
                </h1>
                <p className="text-gray-400">{category.description}</p>
              </div>
            </div>
            
            <StoreSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            {isLoading ? (
              <StoresLoading />
            ) : filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                  <StoreCard 
                    key={store.id} 
                    store={store} 
                    onSelect={handleStoreSelection} 
                  />
                ))}
              </div>
            ) : (
              <NoStoresFound 
                searchTerm={searchTerm}
                onClearSearch={() => setSearchTerm('')}
              />
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
