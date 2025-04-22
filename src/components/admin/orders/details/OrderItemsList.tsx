
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OrderItemsListProps {
  items: string[];
}

const OrderItemsList = ({ items }: OrderItemsListProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Order Items</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderItemsList;
