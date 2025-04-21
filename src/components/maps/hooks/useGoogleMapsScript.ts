
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
    if (!apiKey) {
      setMapLoadError(true);
      onError?.();
      return;
    }

    if (window.google && window.google.maps) {
      setMapLoaded(true);
      onLoad?.();
      return;
    }

    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com/maps/api"]');
    existingScripts.forEach(script => script.remove());

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-added-by-us", "true");
    script.onload = () => {
      setMapLoaded(true);
      onLoad?.();
    };
    script.onerror = () => {
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
