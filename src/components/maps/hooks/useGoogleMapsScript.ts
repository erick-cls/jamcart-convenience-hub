
import { useEffect, useState } from "react";

interface UseGoogleMapsScriptProps {
  apiKey: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function useGoogleMapsScript({ apiKey, onLoad, onError }: UseGoogleMapsScriptProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(false);

  useEffect(() => {
    // Check if API key is valid
    if (!apiKey || apiKey.trim() === "") {
      console.error("Google Maps API key is missing or empty");
      setMapLoadError(true);
      onError?.();
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log("Google Maps API already loaded");
      setMapLoaded(true);
      onLoad?.();
      return;
    }

    // Clean up any existing script tags
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com/maps/api"]');
    existingScripts.forEach(script => script.remove());

    console.log("Loading Google Maps API with key:", apiKey.slice(0, 5) + "...");

    // Create a new script tag with async attribute
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-added-by-us", "true");
    
    script.onload = () => {
      console.log("Google Maps API loaded successfully");
      setMapLoaded(true);
      onLoad?.();
    };
    
    script.onerror = (e) => {
      console.error("Error loading Google Maps API:", e);
      setMapLoadError(true);
      onError?.();
    };
    
    document.head.appendChild(script);

    return () => {
      const ourScript = document.querySelector(
        'script[src*="maps.googleapis.com/maps/api"][data-added-by-us="true"]'
      );
      if (ourScript) {
        document.head.removeChild(ourScript);
      }
    };
  }, [apiKey, onLoad, onError]);

  return { mapLoaded, mapLoadError };
}
