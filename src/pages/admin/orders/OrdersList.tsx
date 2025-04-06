import { useState } from 'react';
import OrderItem, { OrderStatus } from '@/components/ui/OrderItem';
import { useNavigate } from 'react-router-dom';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOrdersState, Order, Rider } from './useOrdersState';

interface OrdersListProps {
  orders: Order[];
  onViewDetails?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: OrderStatus) => void;
  onAssignRider?: (id: string, riderId: string) => void;
  showUserInfo?: boolean;
}

const OrdersList = ({ 
  orders, 
  onViewDetails, 
  onStatusChange,
  onAssignRider,
  showUserInfo = false
}: OrdersListProps) => {
  const navigate = useNavigate();
  const { getAvailableRiders } = useOrdersState();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignRiderDialogOpen, setIsAssignRiderDialogOpen] = useState(false);
  
  const handleViewDetails = (id: string) => {
    const order = orders.find(order => order.id === id);
    
    if (order) {
      setSelectedOrder(order);
      setIsDialogOpen(true);
    }
    
    if (onViewDetails) {
      onViewDetails(id);
    }
  };
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (onStatusChange) {
      onStatusChange(orderId, newStatus);
    }
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleAssignRider = (order: Order) => {
    setSelectedOrder(order);
    setIsAssignRiderDialogOpen(true);
  };

  const handleRiderSelection = (riderId: string) => {
    if (selectedOrder && onAssignRider) {
      onAssignRider(selectedOrder.id, riderId);
      setIsAssignRiderDialogOpen(false);
      setSelectedOrder(null);
    }
  };
  
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const acceptedOrders = orders.filter(order => order.status === 'accepted');
  const completedOrders = orders.filter(order => 
    order.status === 'completed' || order.status === 'declined' || order.status === 'cancelled'
  );
  
  const availableRiders = getAvailableRiders();
  
  return (
    <>
      {pendingOrders.length > 0 && (
        <div className="mb-10">
          <h2 className="font-semibold text-lg mb-4">Pending Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map((order) => (
              <div key={order.id} className="relative">
                {order.isNew && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    New
                  </span>
                )}
                <OrderItem
                  id={order.id}
                  storeName={order.storeName}
                  category={order.category}
                  date={order.date}
                  status={order.status}
                  items={order.items}
                  total={order.total}
                  onViewDetails={handleViewDetails}
                  metadata={
                    showUserInfo && order.userName 
                      ? [
                          { label: "Customer", value: order.userName },
                          order.riderId 
                            ? { label: "Rider", value: order.riderName || 'Unassigned' }
                            : { label: "Rider", value: 'Unassigned' }
                        ]
                      : undefined
                  }
                  actionButton={
                    showUserInfo && !order.riderId ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignRider(order);
                        }}
                      >
                        Assign Rider
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {acceptedOrders.length > 0 && (
        <div className="mb-10">
          <h2 className="font-semibold text-lg mb-4">In Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedOrders.map((order) => (
              <OrderItem
                key={order.id}
                id={order.id}
                storeName={order.storeName}
                category={order.category}
                date={order.date}
                status={order.status}
                items={order.items}
                total={order.total}
                onViewDetails={handleViewDetails}
                metadata={
                  showUserInfo && order.userName 
                    ? [
                        { label: "Customer", value: order.userName },
                        order.riderId 
                          ? { label: "Rider", value: order.riderName || 'Unassigned' }
                          : { label: "Rider", value: 'Unassigned' }
                      ]
                    : undefined
                }
                actionButton={
                  showUserInfo && !order.riderId ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignRider(order);
                      }}
                    >
                      Assign Rider
                    </Button>
                  ) : undefined
                }
              />
            ))}
          </div>
        </div>
      )}
      
      {completedOrders.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4">Completed Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedOrders.map((order) => (
              <OrderItem
                key={order.id}
                id={order.id}
                storeName={order.storeName}
                category={order.category}
                date={order.date}
                status={order.status}
                items={order.items}
                total={order.total}
                onViewDetails={handleViewDetails}
                metadata={
                  showUserInfo && order.userName 
                    ? [
                        { label: "Customer", value: order.userName },
                        order.riderId 
                          ? { label: "Rider", value: order.riderName || 'Unassigned' }
                          : { label: "Rider", value: 'Unassigned' }
                      ]
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}
      
      <OrderDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />

      <Dialog open={isAssignRiderDialogOpen} onOpenChange={setIsAssignRiderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Rider to Order #{selectedOrder?.id.slice(-6)}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {availableRiders.length > 0 ? (
              <div className="space-y-3">
                {availableRiders.map(rider => (
                  <Button
                    key={rider.id}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => handleRiderSelection(rider.id)}
                  >
                    {rider.name}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No available riders.</p>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAssignRiderDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersList;
