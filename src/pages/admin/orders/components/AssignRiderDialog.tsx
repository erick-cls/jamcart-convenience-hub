
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Order, Rider } from '../types';

interface AssignRiderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | null;
  availableRiders: Rider[];
  onAssignRider: (riderId: string) => void;
}

const AssignRiderDialog = ({
  isOpen,
  onClose,
  selectedOrder,
  availableRiders,
  onAssignRider,
}: AssignRiderDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  onClick={() => onAssignRider(rider.id)}
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
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRiderDialog;
