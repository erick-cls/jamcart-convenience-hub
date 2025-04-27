
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createComplaint } from '@/services/complaint.service';
import { Order } from '@/hooks/useUserOrdersState';
import { useAuth } from '@/context/AuthContext';

interface FileComplaintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onComplaintFiled: () => void;
}

const issueTypes = [
  'Wrong items delivered',
  'Missing items',
  'Order damaged',
  'Late delivery',
  'Payment issue',
  'Poor service',
  'Other'
];

const FileComplaintDialog = ({ isOpen, onClose, order, onComplaintFiled }: FileComplaintDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issue: '',
    description: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to file a complaint.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.issue || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please select an issue type and provide a description.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      createComplaint({
        orderId: order.id,
        userId: user.id,
        userName: user.name,
        vendorId: order.storeName, // Using storeName as vendorId here
        issue: formData.issue,
        description: formData.description
      });
      
      toast({
        title: "Complaint filed",
        description: "Your complaint has been submitted successfully.",
      });
      
      // Reset form and close dialog
      setFormData({ issue: '', description: '' });
      onComplaintFiled();
      onClose();
    } catch (error) {
      toast({
        title: "Error filing complaint",
        description: "There was a problem submitting your complaint. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black text-white border-[#20a64f]/30 max-w-lg">
        <DialogHeader>
          <DialogTitle>File a Complaint</DialogTitle>
          <DialogDescription>
            Please provide details about your issue with order #{order.id.slice(-6)}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue">Issue Type</Label>
            <select
              id="issue"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black text-white border border-[#20a64f]/30 rounded-md"
              required
            >
              <option value="">Select Issue Type</option>
              {issueTypes.map(issue => (
                <option key={issue} value={issue}>{issue}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please describe your issue in detail..."
              rows={5}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#20a64f]/30 text-white hover:bg-[#20a64f]/10"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#20a64f] hover:bg-[#20a64f]/80"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FileComplaintDialog;
