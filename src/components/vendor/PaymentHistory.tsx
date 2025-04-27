
import { getVendorPayments } from '@/services/vendor.service';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface PaymentHistoryProps {
  storeId: string;
  commissionRate: number;
}

const PaymentHistory = ({ storeId, commissionRate }: PaymentHistoryProps) => {
  const payments = getVendorPayments(storeId);
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 2,
    });
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Payment History</h3>
      
      {payments.length > 0 ? (
        <div className="border border-[#20a64f]/20 rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#20a64f]/10 hover:bg-[#20a64f]/20">
                <TableHead className="text-white">Payment Date</TableHead>
                <TableHead className="text-white">Period</TableHead>
                <TableHead className="text-white">Orders</TableHead>
                <TableHead className="text-white">Amount</TableHead>
                <TableHead className="text-white">Commission</TableHead>
                <TableHead className="text-white">Net Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(payment => (
                <TableRow key={payment.id} className="hover:bg-[#20a64f]/5">
                  <TableCell>{new Date(payment.datePaid).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {new Date(payment.ordersPeriod.from).toLocaleDateString()} - {new Date(payment.ordersPeriod.to).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{payment.orderCount}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{formatCurrency(payment.commissionAmount)}</TableCell>
                  <TableCell>{formatCurrency(payment.amount - payment.commissionAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-[#20a64f]/5 border border-[#20a64f]/20 rounded-md p-6 text-center">
          <p>No payment history yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Once you start receiving orders, your payment information will appear here.
          </p>
        </div>
      )}
      
      <div className="mt-6 bg-[#20a64f]/5 border border-[#20a64f]/20 rounded-md p-4">
        <h4 className="font-medium mb-2">Payment Schedule</h4>
        <ul className="list-disc list-inside text-sm space-y-2">
          <li>Payments are processed weekly every Monday</li>
          <li>Commission rate: {(commissionRate * 100).toFixed(1)}%</li>
          <li>Payment will be sent to your registered account</li>
          <li>You'll receive an email notification when payment is processed</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentHistory;
