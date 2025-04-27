
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useOrderNotes } from '@/hooks/useOrderNotes';

interface OrderNotesCardProps {
  notes: string;
  estimatedTime: string;
  onNotesChange: (value: string) => void;
  onEstimatedTimeChange: (value: string) => void;
  onSave: () => void;
}

const OrderNotesCard = ({ 
  notes: initialNotes, 
  estimatedTime: initialEstimatedTime, 
  onNotesChange,
  onEstimatedTimeChange,
  onSave 
}: OrderNotesCardProps) => {
  const {
    notes,
    estimatedTime,
    handleNotesChange,
    handleEstimatedTimeChange,
    handleSave
  } = useOrderNotes({
    initialNotes,
    initialEstimatedTime,
    onSave: () => {
      onNotesChange(notes);
      onEstimatedTimeChange(estimatedTime);
      onSave();
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Notes & Preparation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Estimated Preparation Time (minutes)
            </label>
            <Input 
              type="number" 
              value={estimatedTime} 
              onChange={(e) => handleEstimatedTimeChange(e.target.value)}
              placeholder="E.g., 20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Notes for Customer
            </label>
            <Textarea 
              value={notes} 
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add any notes about the order..."
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleSave}
            className="w-full"
            variant="outline"
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderNotesCard;
