import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Percent, Trash2 } from 'lucide-react';
import { VendorCommission } from '@/types/vendor.types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

interface VendorListProps {
  vendors: VendorCommission[];
  onEdit: (vendor: VendorCommission) => void;
  onToggleStatus: (vendorId: string, active: boolean) => void;
  onDelete: (vendorId: string) => void;
}

const VendorList = ({ vendors, onEdit, onToggleStatus, onDelete }: VendorListProps) => {
  const [vendorToDelete, setVendorToDelete] = useState<VendorCommission | null>(null);

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

  const handleDeleteClick = (vendor: VendorCommission) => {
    setVendorToDelete(vendor);
  };

  const handleConfirmDelete = () => {
    if (vendorToDelete) {
      onDelete(vendorToDelete.id);
      setVendorToDelete(null);
    }
  };

  return (
    <>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(vendor)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
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

      <AlertDialog open={!!vendorToDelete} onOpenChange={() => setVendorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor Fee Rate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the fee rate for {vendorToDelete?.vendorName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVendorToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VendorList;
