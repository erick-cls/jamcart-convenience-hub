
import VendorLayout from '@/components/vendor/VendorLayout';

const LoadingState = () => {
  return (
    <VendorLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jamcart-green border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    </VendorLayout>
  );
};

export default LoadingState;
