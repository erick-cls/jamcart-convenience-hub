
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderPageHeaderProps {
  storeName: string;
  categoryIcon: string;
  categoryName: string;
  categoryId: string;
}

const OrderPageHeader = ({ storeName, categoryIcon, categoryName, categoryId }: OrderPageHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mb-6">
      <button
        className="p-2 rounded-full hover:bg-gray-200 mr-3"
        onClick={() => navigate(`/category/${categoryId}`)}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{storeName}</h1>
        <p className="text-gray-600 flex items-center">
          <span className="mr-2">{categoryIcon}</span>
          {categoryName}
        </p>
      </div>
    </div>
  );
};

export default OrderPageHeader;
