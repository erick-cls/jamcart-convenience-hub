
import { useState, useEffect } from 'react';

const TEST_API_KEY = "AIzaSyA6vF-6SZ8HX_2kCK0BK0OX2PP6hIhyH6E";

export const useGoogleMapsSetup = () => {
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    let savedKeys = localStorage.getItem('apiKeys');
    
    if (!savedKeys) {
      const testApiKey = {
        googleMaps: TEST_API_KEY
      };
      localStorage.setItem('apiKeys', JSON.stringify(testApiKey));
      savedKeys = JSON.stringify(testApiKey);
    } else {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        if (!parsedKeys.googleMaps) {
          parsedKeys.googleMaps = TEST_API_KEY;
          localStorage.setItem('apiKeys', JSON.stringify(parsedKeys));
        }
      } catch (e) {
        console.error("Error parsing API keys:", e);
        const testApiKey = {
          googleMaps: TEST_API_KEY
        };
        localStorage.setItem('apiKeys', JSON.stringify(testApiKey));
      }
    }
  }, []);

  const handleAddTestApiKey = () => {
    const testApiKey = {
      googleMaps: TEST_API_KEY
    };
    localStorage.setItem('apiKeys', JSON.stringify(testApiKey));
    window.location.reload();
  };

  return {
    mapError,
    setMapError,
    handleAddTestApiKey
  };
};
