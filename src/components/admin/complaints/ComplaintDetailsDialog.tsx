
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Complaint, ComplaintStatus } from '@/types/complaint.types';

interface ComplaintDetailsDialogProps {
  isOpen: boolean;
  complaint: Complaint;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ComplaintStatus, notes?: string, resolution?: string) => void;
}

const statusColors = {
  pending: 'bg-orange-500',
  under_review: 'bg-blue-500',
  resolved: 'bg-green-500',
  dismissed: 'bg-red-500',
};

const statusLabels = {
  pending: 'Pending',
  under_review: 'Under Review',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
};

const ComplaintDetailsDialog = ({
  isOpen,
  complaint,
  onClose,
  onUpdateStatus,
}: ComplaintDetailsDialogProps) => {
  const [notes, setNotes] = useState(complaint.adminNotes || '');
  const [resolution, setResolution] = useState(complaint.resolution || '');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusChange = (status: ComplaintStatus) => {
    setIsUpdating(true);
    onUpdateStatus(complaint.id, status, notes, resolution);
    setIsUpdating(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Complaint #{complaint.id.slice(-6)}</span>
            <Badge className={statusColors[complaint.status]}>
              {statusLabels[complaint.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Order ID</Label>
            <p>#{complaint.orderId.slice(-6)}</p>
          </div>
          
          <div>
            <Label className="text-muted-foreground">Customer</Label>
            <p>{complaint.userName}</p>
          </div>
          
          <div>
            <Label className="text-muted-foreground">Issue Type</Label>
            <p>{complaint.issue}</p>
          </div>
          
          <div>
            <Label className="text-muted-foreground">Description</Label>
            <div className="mt-1 p-3 bg-muted rounded-md">
              {complaint.description}
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this complaint..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="resolution">Resolution</Label>
            <Textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Describe how the issue was resolved..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-muted-foreground">Date Filed</Label>
            <p>{new Date(complaint.created).toLocaleString()}</p>
          </div>
          
          <div>
            <Label className="text-muted-foreground">Last Updated</Label>
            <p>{new Date(complaint.updated).toLocaleString()}</p>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex gap-2">
            {complaint.status !== 'under_review' && (
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange('under_review')} 
                disabled={isUpdating}
                className="flex-1"
              >
                Mark Under Review
              </Button>
            )}
            {complaint.status !== 'resolved' && (
              <Button 
                onClick={() => handleStatusChange('resolved')} 
                disabled={isUpdating}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Mark Resolved
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {complaint.status !== 'dismissed' && (
              <Button 
                variant="destructive" 
                onClick={() => handleStatusChange('dismissed')} 
                disabled={isUpdating}
              >
                Dismiss
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isUpdating}
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetailsDialog;
