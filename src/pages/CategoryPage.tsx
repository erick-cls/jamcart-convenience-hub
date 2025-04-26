
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategorySearch from '@/components/category/CategorySearch';
import StoreList from '@/components/category/StoreList';
import { categories, mockStores } from '@/utils/order/mockStoreData';
import type { Store } from '@/types/store';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  
  useEffect(() => {
    if (!categoryId || !Object.keys(categories).includes(categoryId)) {
      navigate('/categories');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      // Convert mockStores data to Store[] type for the selected category
      const categoryStores = Object.values(mockStores)
        .filter(store => store.category === categoryId)
        .map(store => ({
          id: store.id,
          name: store.name,
          image: store.image,
          rating: store.rating,
          distance: store.distance,
          estimatedTime: store.estimatedTime,
          address: store.address
        }));
      
      setStores(categoryStores);
      setIsLoading(false);
    }, 800);
  }, [categoryId, navigate]);
  
  const category = categoryId ? categories[categoryId as keyof typeof categories] : null;
  
  const handleStoreSelection = (storeId: string) => {
    if (storeId === '') {
      setSearchTerm('');
      return;
    }
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
                <h1 className="text-3xl font-bold flex items-center text-white">
                  <span className="mr-3 text-4xl">{category.icon}</span>
                  {category.name}
                </h1>
                <p className="text-gray-400">{category.description}</p>
              </div>
            </div>
            
            <CategorySearch 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />
            
            <StoreList 
              stores={stores}
              searchTerm={searchTerm}
              isLoading={isLoading}
              onStoreSelect={handleStoreSelection}
            />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
