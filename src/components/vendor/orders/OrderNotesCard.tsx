
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface OrderNotesCardProps {
  notes: string;
  estimatedTime: string;
  onNotesChange: (value: string) => void;
  onEstimatedTimeChange: (value: string) => void;
  onSave: () => void;
}

const OrderNotesCard = ({ 
  notes, 
  estimatedTime, 
  onNotesChange, 
  onEstimatedTimeChange, 
  onSave 
}: OrderNotesCardProps) => {
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
              onChange={(e) => onEstimatedTimeChange(e.target.value)}
              placeholder="E.g., 20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Notes for Customer
            </label>
            <Textarea 
              value={notes} 
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add any notes about the order..."
              rows={3}
            />
          </div>
          
          <Button 
            onClick={onSave}
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
