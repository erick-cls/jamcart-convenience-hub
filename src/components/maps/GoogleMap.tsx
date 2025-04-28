import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useGoogleMapsScript } from "./hooks/useGoogleMapsScript";
import { createMarker } from "./utils/createMarker";
import { drawDirections } from "./utils/drawDirections";

interface Coordinates {
  lat: number;
  lng: number;
}
interface RiderPin extends Coordinates { name: string }

interface GoogleMapProps {
  customerLocation?: Coordinates;
  riderLocation?: Coordinates;
  riderLocations?: RiderPin[]; // <-- new: show all riders
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
  try {
    const savedKeys = localStorage.getItem("apiKeys");
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      return parsedKeys.googleMaps || "";
    }
  } catch (e) {
    console.error("Error parsing API keys:", e);
    // Fallback to test API key if available
    const testKey = "AIzaSyA6vF-6SZ8HX_2kCK0BK0OX2PP6hIhyH6E";
    console.log("Using fallback API key");
    return testKey;
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
  riderLocations,
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
  const [riderMarkers, setRiderMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  // Get API key
  const apiKey = getApiKey();
  
  // Log key availability for debugging
  useEffect(() => {
    if (apiKey) {
      console.log("Google Maps API key available", apiKey.slice(0, 5) + "...");
    } else {
      console.error("No Google Maps API key found");
    }
  }, [apiKey]);

  const { mapLoaded, mapLoadError } = useGoogleMapsScript({
    apiKey,
    onLoad: () => {
      console.log("Map script loaded callback");
      onLoad?.();
    },
    onError: () => {
      console.error("Map script failed to load");
      toast({
        title: "Error loading Google Maps",
        description: "Please check your API key in Admin Settings",
        variant: "destructive",
      });
      onError?.();
    },
  });

  // Clean up function to remove markers and renderers
  const cleanUpMap = () => {
    if (customerMarker) customerMarker.setMap(null);
    riderMarkers.forEach(marker => marker.setMap(null));
    if (directionsRenderer) directionsRenderer.setMap(null);
  };

  useEffect(() => {
    return () => {
      cleanUpMap();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google || !window.google.maps) {
      if (!mapLoaded) console.log("Map not loaded yet");
      if (!window.google) console.log("Google API not available yet");
      return;
    }

    console.log("Initializing map");
    
    try {
      // Clean up old markers
      cleanUpMap();

      const defaultCenter = { lat: 18.0179, lng: -76.8099 };
      let center = customerLocation || riderLocation || defaultCenter;
      if (riderLocations && riderLocations.length) {
        center = { lat: riderLocations[0].lat, lng: riderLocations[0].lng };
      }

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: showControls,
        streetViewControl: showControls,
        fullscreenControl: showControls,
        zoomControl: showControls,
      });

      setMap(mapInstance);
      console.log("Map instance created");

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

      // Rider markers (multi-pin)
      let newRiderMarkers: google.maps.Marker[] = [];
      if (riderLocations && riderLocations.length) {
        newRiderMarkers = riderLocations.map((r, i) =>
          createMarker({
            map: mapInstance,
            position: { lat: r.lat, lng: r.lng },
            title: "Rider: " + r.name,
            initials: getInitials(r.name),
            color: "#22c55e", // green
            infoWindowContent: `<div><strong>Rider Location</strong><div>${r.name}</div><div><small>On the way</small></div></div>`,
          })
        ).filter(Boolean) as google.maps.Marker[];
        setRiderMarkers(newRiderMarkers);
      } else if (riderLocation) {
        // fallback: single rider marker for old usage
        const singleRiderMarker = createMarker({
          map: mapInstance,
          position: riderLocation,
          title: "Rider: " + riderName,
          initials: getInitials(riderName),
          color: "#22c55e", // green
          infoWindowContent: `<div><strong>Rider Location</strong><div>${riderName}</div><div><small>On the way</small></div></div>`,
        });
        setRiderMarkers(singleRiderMarker ? [singleRiderMarker] : []);
      } else {
        setRiderMarkers([]);
      }

      // Path (only if single rider, preserve old logic & UI for details page)
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
    // eslint-disable-next-line
  }, [mapLoaded, customerLocation, riderLocation, riderLocations, zoom, showControls, customerName, riderName, onError]);

  useEffect(() => {
    if (!map) return;

    try {
      if (customerLocation && customerMarker) {
        customerMarker.setPosition(customerLocation);
      }

      // Multi-rider pin update
      if (riderLocations && riderLocations.length && riderMarkers.length === riderLocations.length) {
        riderMarkers.forEach((marker, i) => {
          const loc = riderLocations[i];
          marker.setPosition({ lat: loc.lat, lng: loc.lng });
        });
      } else if (riderLocation && riderMarkers.length === 1) {
        riderMarkers[0].setPosition(riderLocation);
      }

      // Update directions if both markers exist (single rider mode)
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
    // eslint-disable-next-line
  }, [customerLocation, riderLocation, riderLocations, map, customerMarker, riderMarkers]);

  if (mapLoadError) {
    return (
      <div
        className={`rounded-lg shadow-md ${className} bg-gray-100 flex items-center justify-center`}
        style={{ height, width: "100%" }}
      >
        <div className="text-center p-4">
          <p className="text-gray-500 font-medium">Map couldn't be loaded</p>
          <p className="text-gray-400 text-sm mt-1">Check your API key in Admin Settings</p>
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
