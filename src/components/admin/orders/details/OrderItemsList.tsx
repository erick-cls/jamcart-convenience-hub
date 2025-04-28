
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderItem } from '@/pages/admin/orders/types';

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList = ({ items }: OrderItemsListProps) => {
  // Ensure items is always an array
  const orderItems = Array.isArray(items) ? items : [];
  
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Order Items</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItems.length > 0 ? (
            orderItems.map((item, index) => {
              // Ensure price and quantity are numbers
              const price = typeof item.price === 'number' ? item.price : 0;
              const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
              const total = price * quantity;
              
              return (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${price.toFixed(2)}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>${total.toFixed(2)}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-gray-500">No items found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderItemsList;
