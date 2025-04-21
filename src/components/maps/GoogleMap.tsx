
import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useGoogleMapsScript } from "./hooks/useGoogleMapsScript";
import { createMarker } from "./utils/createMarker";
import { drawDirections } from "./utils/drawDirections";

interface Coordinates {
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  customerLocation?: Coordinates;
  riderLocation?: Coordinates;
  customerName?: string;
  riderName?: string;
  height?: string;
  className?: string;
  zoom?: number;
  showControls?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const getApiKey = () => {
  const savedKeys = localStorage.getItem("apiKeys");
  if (savedKeys) {
    try {
      const parsedKeys = JSON.parse(savedKeys);
      return parsedKeys.googleMaps || "";
    } catch (e) {
      console.error("Error parsing API keys:", e);
      return "";
    }
  }
  return "";
};

// Helper function to get initials from name
const getInitials = (name: string = ""): string => {
  return name
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const GoogleMap = ({
  customerLocation,
  riderLocation,
  customerName = "Customer",
  riderName = "Rider",
  height = "400px",
  className = "",
  zoom = 15,
  showControls = true,
  onLoad,
  onError,
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [customerMarker, setCustomerMarker] = useState<google.maps.Marker | null>(null);
  const [riderMarker, setRiderMarker] = useState<google.maps.Marker | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  const apiKey = getApiKey();
  const { mapLoaded, mapLoadError } = useGoogleMapsScript({
    apiKey,
    onLoad,
    onError: () => {
      onError?.();
      toast({
        title: "Error loading Google Maps",
        description: "Please check your API key and try again",
        variant: "destructive",
      });
    },
  });

  // Clean up function to remove markers and renderers
  const cleanUpMap = () => {
    if (customerMarker) customerMarker.setMap(null);
    if (riderMarker) riderMarker.setMap(null);
    if (directionsRenderer) directionsRenderer.setMap(null);
  };

  useEffect(() => {
    return () => {
      cleanUpMap();
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google || !window.google.maps) return;

    try {
      // Clean up old markers
      cleanUpMap();

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

      // Customer marker
      let newCustomerMarker: google.maps.Marker | null = null;
      if (customerLocation) {
        const customerInitials = getInitials(customerName);
        newCustomerMarker = createMarker({
          map: mapInstance,
          position: customerLocation,
          title: "Customer: " + customerName,
          initials: customerInitials,
          color: "#3b82f6", // blue
          infoWindowContent: `<div><strong>Customer Location</strong><div>${customerName}</div></div>`,
        });
        setCustomerMarker(newCustomerMarker);
      }

      // Rider marker
      let newRiderMarker: google.maps.Marker | null = null;
      if (riderLocation) {
        const riderInitials = getInitials(riderName);
        newRiderMarker = createMarker({
          map: mapInstance,
          position: riderLocation,
          title: "Rider: " + riderName,
          initials: riderInitials,
          color: "#22c55e", // green
          infoWindowContent: `<div><strong>Rider Location</strong><div>${riderName}</div><div><small>On the way</small></div></div>`,
        });
        setRiderMarker(newRiderMarker);
      }

      // Path
      if (customerLocation && riderLocation) {
        drawDirections({
          map: mapInstance,
          origin: riderLocation,
          destination: customerLocation,
        });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      onError?.();
    }
  }, [mapLoaded, customerLocation, riderLocation, zoom, showControls, customerName, riderName, onError]);

  useEffect(() => {
    if (!map) return;
    
    try {
      if (customerLocation && customerMarker) {
        customerMarker.setPosition(customerLocation);
      }
      
      if (riderLocation && riderMarker) {
        riderMarker.setPosition(riderLocation);
      }
      
      // Update directions if both markers exist
      if (customerLocation && riderLocation) {
        drawDirections({
          map: map,
          origin: riderLocation,
          destination: customerLocation,
        });
      }
    } catch (error) {
      console.error("Error updating marker positions:", error);
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
