
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User } from '@/types/auth.types';

interface ProfileFormProps {
  user: User;
  onSubmit: (formData: Partial<User>) => Promise<void>;
}

const ProfileForm = ({ user, onSubmit }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    town: user?.town || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={formData.name} 
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email} 
            readOnly 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            value={formData.phone} 
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="town">Town</Label>
          <Input 
            id="town" 
            value={formData.town} 
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Primary Address</Label>
        <Textarea 
          id="address" 
          value={formData.address} 
          onChange={handleChange}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
