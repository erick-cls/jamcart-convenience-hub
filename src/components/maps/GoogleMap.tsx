
import { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface Coordinates {
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  customerLocation?: Coordinates;
  riderLocation?: Coordinates;
  height?: string;
  className?: string;
  zoom?: number;
  showControls?: boolean;
}

const GoogleMap = ({ 
  customerLocation, 
  riderLocation, 
  height = "400px",
  className = "",
  zoom = 15,
  showControls = true
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [customerMarker, setCustomerMarker] = useState<google.maps.Marker | null>(null);
  const [riderMarker, setRiderMarker] = useState<google.maps.Marker | null>(null);
  
  // Get Maps API key from local storage
  const getApiKey = () => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      return parsedKeys.googleMaps || '';
    }
    return '';
  };

  // Load the Google Maps script
  useEffect(() => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      toast({
        title: "Google Maps API Key missing",
        description: "Please add your Google Maps API key in Admin Settings",
        variant: "destructive",
      });
      return;
    }
    
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setMapLoaded(true);
      };
      
      script.onerror = () => {
        toast({
          title: "Error loading Google Maps",
          description: "Please check your API key and try again",
          variant: "destructive",
        });
      };
      
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
    
    return () => {
      // Clean up only the script we added
      const ourScript = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (ourScript && ourScript.getAttribute('data-added-by-us')) {
        document.head.removeChild(ourScript);
      }
    };
  }, []);
  
  // Initialize the map once the script is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return;
    
    // Default to Kingston, Jamaica if no locations provided
    const defaultCenter = { lat: 18.0179, lng: -76.8099 };
    const center = customerLocation || riderLocation || defaultCenter;
    
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeControl: showControls,
      streetViewControl: showControls,
      fullscreenControl: showControls,
      zoomControl: showControls,
    });
    
    setMap(mapInstance);
    
    // Create markers if locations exist
    if (customerLocation) {
      const marker = new window.google.maps.Marker({
        position: customerLocation,
        map: mapInstance,
        title: "Customer",
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
      });
      
      setCustomerMarker(marker);
      
      // Add info window for customer
      const infoWindow = new window.google.maps.InfoWindow({
        content: "<div><strong>Customer Location</strong></div>"
      });
      
      marker.addListener("click", () => {
        infoWindow.open(mapInstance, marker);
      });
    }
    
    if (riderLocation) {
      const marker = new window.google.maps.Marker({
        position: riderLocation,
        map: mapInstance,
        title: "Rider",
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }
      });
      
      setRiderMarker(marker);
      
      // Add info window for rider
      const infoWindow = new window.google.maps.InfoWindow({
        content: "<div><strong>Rider Location</strong><div><small>On the way</small></div></div>"
      });
      
      marker.addListener("click", () => {
        infoWindow.open(mapInstance, marker);
      });
    }
    
    // If both locations exist, draw a path between them
    if (customerLocation && riderLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#FFD700",
          strokeWeight: 5
        }
      });
      
      directionsRenderer.setMap(mapInstance);
      
      directionsService.route({
        origin: riderLocation,
        destination: customerLocation,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        }
      });
    }
    
    // Clean up on unmount
    return () => {
      if (customerMarker) customerMarker.setMap(null);
      if (riderMarker) riderMarker.setMap(null);
    };
  }, [mapLoaded, customerLocation, riderLocation, zoom, showControls]);
  
  // Update markers if locations change
  useEffect(() => {
    if (!map) return;
    
    if (customerLocation && customerMarker) {
      customerMarker.setPosition(customerLocation);
    }
    
    if (riderLocation && riderMarker) {
      riderMarker.setPosition(riderLocation);
    }
  }, [customerLocation, riderLocation, map, customerMarker, riderMarker]);
  
  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg shadow-md ${className}`} 
      style={{ height, width: "100%" }}
    >
      {!mapLoaded && (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <p className="text-gray-500">Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
