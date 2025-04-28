
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Percent } from 'lucide-react';
import { VendorCommission } from '@/types/vendor.types';

interface VendorListProps {
  vendors: VendorCommission[];
  onEdit: (vendor: VendorCommission) => void;
  onToggleStatus: (vendorId: string, active: boolean) => void;
}

const VendorList = ({ vendors, onEdit, onToggleStatus }: VendorListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const getScheduleLabel = (schedule: 'weekly' | 'bi-monthly' | 'monthly') => {
    switch (schedule) {
      case 'weekly':
        return 'Weekly';
      case 'bi-monthly':
        return 'Bi-Monthly';
      case 'monthly':
        return 'Monthly';
      default:
        return schedule;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Percent className="mr-2 h-5 w-5 text-orange-500" />
          Vendor Fee Rates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vendors.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">
                      <div>
                        {vendor.vendorName}
                        <div className="text-xs text-gray-500">{vendor.vendorEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.rate}%</TableCell>
                    <TableCell>{getScheduleLabel(vendor.schedule)}</TableCell>
                    <TableCell>{formatDate(vendor.nextPaymentDate)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={vendor.active ? "default" : "outline"}
                        className={vendor.active ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {vendor.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(vendor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Switch 
                          checked={vendor.active}
                          onCheckedChange={(checked) => onToggleStatus(vendor.id, checked)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No vendors found. Add a vendor to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorList;
