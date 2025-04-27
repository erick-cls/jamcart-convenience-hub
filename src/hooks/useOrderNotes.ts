
import { useState } from 'react';

interface UseOrderNotesProps {
  initialNotes?: string;
  initialEstimatedTime?: string;
  onSave: () => void;
}

export const useOrderNotes = ({ 
  initialNotes = '', 
  initialEstimatedTime = '', 
  onSave 
}: UseOrderNotesProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [estimatedTime, setEstimatedTime] = useState(initialEstimatedTime);

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const handleEstimatedTimeChange = (value: string) => {
    setEstimatedTime(value);
  };

  const handleSave = () => {
    onSave();
  };

  return {
    notes,
    estimatedTime,
    handleNotesChange,
    handleEstimatedTimeChange,
    handleSave
  };
};
