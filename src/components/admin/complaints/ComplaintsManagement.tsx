
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllComplaints, updateComplaintStatus } from '@/services/complaint.service';
import { Complaint, ComplaintStatus } from '@/types/complaint.types';
import ComplaintDetailsDialog from './ComplaintDetailsDialog';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  pending: 'bg-orange-500 hover:bg-orange-600',
  under_review: 'bg-blue-500 hover:bg-blue-600',
  resolved: 'bg-green-500 hover:bg-green-600',
  dismissed: 'bg-red-500 hover:bg-red-600',
};

const statusLabels = {
  pending: 'Pending',
  under_review: 'Under Review',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
};

const ComplaintsManagement = () => {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ComplaintStatus | 'all'>('all');
  
  useEffect(() => {
    loadComplaints();
    
    // Listen for new complaints
    const handleComplaintFiled = () => {
      loadComplaints();
    };
    
    window.addEventListener('complaint-filed', handleComplaintFiled);
    
    return () => {
      window.removeEventListener('complaint-filed', handleComplaintFiled);
    };
  }, []);
  
  const loadComplaints = () => {
    const allComplaints = getAllComplaints();
    // Sort by created date (newest first)
    allComplaints.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    setComplaints(allComplaints);
  };
  
  const filteredComplaints = activeFilter === 'all' 
    ? complaints 
    : complaints.filter(complaint => complaint.status === activeFilter);
  
  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDialogOpen(true);
  };
  
  const handleUpdateStatus = (
    complaintId: string, 
    status: ComplaintStatus, 
    notes?: string,
    resolution?: string
  ) => {
    const updatedComplaint = updateComplaintStatus(complaintId, status, notes, resolution);
    
    if (updatedComplaint) {
      loadComplaints();
      setSelectedComplaint(updatedComplaint);
      
      toast({
        title: "Complaint Updated",
        description: `Complaint status changed to ${statusLabels[status]}.`,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Customer Complaints</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'outline'} 
            onClick={() => setActiveFilter('all')}
            className="text-xs"
          >
            All
          </Button>
          <Button 
            variant={activeFilter === 'pending' ? 'default' : 'outline'} 
            onClick={() => setActiveFilter('pending')}
            className="text-xs"
          >
            Pending
          </Button>
          <Button 
            variant={activeFilter === 'under_review' ? 'default' : 'outline'} 
            onClick={() => setActiveFilter('under_review')}
            className="text-xs"
          >
            Under Review
          </Button>
          <Button 
            variant={activeFilter === 'resolved' ? 'default' : 'outline'} 
            onClick={() => setActiveFilter('resolved')}
            className="text-xs"
          >
            Resolved
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Date Filed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map(complaint => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">#{complaint.orderId.slice(-6)}</TableCell>
                    <TableCell>{complaint.userName}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={complaint.issue}>
                      {complaint.issue}
                    </TableCell>
                    <TableCell>{new Date(complaint.created).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[complaint.status]}>
                        {statusLabels[complaint.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(complaint)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No complaints {activeFilter !== 'all' ? `with "${statusLabels[activeFilter]}" status` : ''} found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedComplaint && (
        <ComplaintDetailsDialog 
          isOpen={isDialogOpen}
          complaint={selectedComplaint}
          onClose={() => setIsDialogOpen(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default ComplaintsManagement;
