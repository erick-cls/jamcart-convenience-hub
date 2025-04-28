
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isEditing, onCancel }: FormActionsProps) => (
  <div className="flex justify-between pt-4">
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit">
      {isEditing ? 'Update' : 'Save'} Fee
    </Button>
  </div>
);
