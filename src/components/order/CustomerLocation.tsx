
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GoogleMap from '@/components/maps/GoogleMap';
import { toast } from '@/hooks/use-toast';

interface CustomerLocationProps {
  customerLocation: { lat: number; lng: number } | null;
  customerName?: string;
  isLoadingLocation: boolean;
  locationError: string | null;
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
}

const CustomerLocation = ({ 
  customerLocation, 
  customerName, 
  isLoadingLocation,
  locationError,
  onLocationUpdate
}: CustomerLocationProps) => {
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          onLocationUpdate(location);
          toast({
            title: "Location updated",
            description: "Your current location has been set",
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          toast({
            title: "Location error",
            description: "Couldn't access your location. Please enable location services.",
            variant: "destructive",
          });
          onLocationUpdate({ lat: 18.0179, lng: -76.8099 });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      onLocationUpdate({ lat: 18.0179, lng: -76.8099 });
    }
  };

  return (
    <div className="mt-6 border rounded-lg overflow-hidden shadow-sm sticky top-24">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-medium">Your Location</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          <MapPin className="h-4 w-4" />
          {isLoadingLocation ? "Getting Location..." : "Use Current Location"}
        </Button>
      </div>
      
      {locationError && (
        <div className="p-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
          {locationError}
        </div>
      )}
      
      <GoogleMap
        customerLocation={customerLocation || undefined}
        customerName={customerName || "You"}
        height="200px"
        zoom={13}
        showControls={false}
      />
    </div>
  );
};

export default CustomerLocation;
