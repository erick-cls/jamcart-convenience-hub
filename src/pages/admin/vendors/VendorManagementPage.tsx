
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VendorList from '@/components/admin/vendors/VendorList';
import VendorCommissionForm from '@/components/admin/vendors/VendorCommissionForm';
import PageHeader from '@/components/admin/vendors/PageHeader';
import { useVendorManagement } from '@/hooks/useVendorManagement';

const VendorManagementPage = () => {
  const {
    vendors,
    selectedVendor,
    isEditing,
    handleSaveCommission,
    handleEditVendor,
    handleToggleVendorStatus,
    handleDeleteVendor,
    setSelectedVendor,
    setIsEditing
  } = useVendorManagement();

  return (
    <div className="py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VendorList 
              vendors={vendors}
              onEdit={handleEditVendor}
              onToggleStatus={handleToggleVendorStatus}
              onDelete={handleDeleteVendor}
            />
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit' : 'Set'} Fee Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <VendorCommissionForm 
                  vendor={selectedVendor}
                  isEditing={isEditing}
                  onSave={handleSaveCommission}
                  onCancel={() => {
                    setSelectedVendor(null);
                    setIsEditing(false);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManagementPage;
