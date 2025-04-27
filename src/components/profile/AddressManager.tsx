
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Map, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UserAddress } from '@/types/auth.types';

interface AddressManagerProps {
  addresses: UserAddress[];
  onAddressesChange: (addresses: UserAddress[]) => void;
  onSubmit: () => void;
}

const AddressManager = ({ addresses, onAddressesChange, onSubmit }: AddressManagerProps) => {
  const [selectedAddressType, setSelectedAddressType] = useState('home');
  const [newAddress, setNewAddress] = useState('');

  const handleAddNewAddress = () => {
    if (!newAddress.trim()) return;
    
    const newAddressObj = {
      type: selectedAddressType,
      address: newAddress
    };
    
    const updatedAddresses = [...addresses, newAddressObj];
    onAddressesChange(updatedAddresses);
    setNewAddress('');
  };

  const handleRemoveAddress = (index: number) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    onAddressesChange(updatedAddresses);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationString = `Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`;
          setNewAddress(locationString);
          setSelectedAddressType('current');
          
          toast({
            title: "Location Retrieved",
            description: "Your current location has been added.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to retrieve your location. Please check your permissions.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {addresses.map((address, index) => (
        <div key={index} className="flex items-start border rounded-md p-3 bg-gray-50">
          <div className="flex-grow">
            <div className="flex items-center mb-1">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium capitalize">{address.type} Address</span>
            </div>
            <p className="text-sm text-gray-700">{address.address}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleRemoveAddress(index)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      
      <div className="border rounded-md p-4">
        <h3 className="text-sm font-medium mb-3">Add New Address</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Address Type</Label>
            <RadioGroup 
              defaultValue="home" 
              value={selectedAddressType}
              onValueChange={setSelectedAddressType}
              className="flex flex-row space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="address-home" />
                <Label htmlFor="address-home">Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="office" id="address-office" />
                <Label htmlFor="address-office">Office</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="address-other" />
                <Label htmlFor="address-other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-address">Address</Label>
            <div className="flex space-x-2">
              <Textarea 
                id="new-address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter your address"
                className="flex-grow"
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleUseCurrentLocation}
              className="flex items-center"
            >
              <Map className="h-4 w-4 mr-2" />
              Use Current Location
            </Button>
            
            <Button
              type="button"
              onClick={handleAddNewAddress}
              disabled={!newAddress.trim()}
            >
              Add Address
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button onClick={onSubmit}>
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default AddressManager;
