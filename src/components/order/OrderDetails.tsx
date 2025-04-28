
import { Calendar } from 'lucide-react';

interface OrderDetailsProps {
  orderDetails: {
    id: string;
    date: string;
    time: string;
    status: string;
    items: string[];
    total: number;
  };
}

const OrderDetails = ({ orderDetails }: OrderDetailsProps) => {
  // Ensure total is a number
  const total = typeof orderDetails.total === 'number' ? orderDetails.total : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Order #{orderDetails.id.slice(-6)}</h2>
            <div className="flex items-center mt-2 text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{orderDetails.date} at {orderDetails.time}</span>
            </div>
          </div>
          <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Order {orderDetails.status}
          </div>
        </div>
      </div>
      
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-medium mb-3">Order Items</h3>
        <ul className="space-y-2">
          {orderDetails.items.map((item, index) => (
            <li key={index} className="flex justify-between text-gray-600">
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
