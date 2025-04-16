
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
  onLoad?: () => void;
  onError?: () => void;
}

const GoogleMap = ({ 
  customerLocation, 
  riderLocation, 
  height = "400px",
  className = "",
  zoom = 15,
  showControls = true,
  onLoad,
  onError
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [customerMarker, setCustomerMarker] = useState<google.maps.Marker | null>(null);
  const [riderMarker, setRiderMarker] = useState<google.maps.Marker | null>(null);
  const [mapLoadError, setMapLoadError] = useState(false);
  
  // Get Maps API key from local storage
  const getApiKey = () => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        return parsedKeys.googleMaps || '';
      } catch (e) {
        console.error("Error parsing API keys:", e);
        return '';
      }
    }
    return '';
  };

  // Load the Google Maps script
  useEffect(() => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      setMapLoadError(true);
      onError?.();
      return;
    }
    
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    // Remove any existing Google Maps scripts to prevent duplicates
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com/maps/api"]');
    existingScripts.forEach(script => script.remove());
    
    // Add new script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-added-by-us', 'true');
    
    script.onload = () => {
      setMapLoaded(true);
      onLoad?.();
    };
    
    script.onerror = () => {
      setMapLoadError(true);
      onError?.();
      toast({
        title: "Error loading Google Maps",
        description: "Please check your API key and try again",
        variant: "destructive",
      });
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Clean up only the script we added
      const ourScript = document.querySelector('script[src*="maps.googleapis.com/maps/api"][data-added-by-us="true"]');
      if (ourScript) {
        document.head.removeChild(ourScript);
      }
    };
  }, [onLoad, onError]);
  
  // Initialize the map once the script is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google || !window.google.maps) return;
    
    try {
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
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapLoadError(true);
      onError?.();
    }
    
    // Clean up on unmount
    return () => {
      if (customerMarker) customerMarker.setMap(null);
      if (riderMarker) riderMarker.setMap(null);
    };
  }, [mapLoaded, customerLocation, riderLocation, zoom, showControls, onError]);
  
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
  
  if (mapLoadError) {
    return (
      <div 
        className={`rounded-lg shadow-md ${className} bg-gray-100 flex items-center justify-center`} 
        style={{ height, width: "100%" }}
      >
        <div className="text-center p-4">
          <p className="text-gray-500 font-medium">Map couldn't be loaded</p>
          <p className="text-gray-400 text-sm mt-1">Check your API key and internet connection</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg shadow-md ${className}`} 
      style={{ height, width: "100%" }}
    >
      {!mapLoaded && (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-2"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
