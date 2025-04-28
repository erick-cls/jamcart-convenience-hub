import { useState, useEffect } from 'react';

const DEFAULT_LOCATION = { lat: 18.0179, lng: -76.8099 }; // Kingston, Jamaica

export const useLocationTracking = (rider: { name: string; phone: string } | null) => {
  const [customerLocation, setCustomerLocation] = useState(DEFAULT_LOCATION);
  const [riderLocation, setRiderLocation] = useState({ lat: 18.0250, lng: -76.8150 });

  // Get user's current location if permission granted
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Keep default location for Kingston, Jamaica
        }
      );
    }
  }, []);

  // Simulate rider movement toward customer location
  useEffect(() => {
    if (!rider) return;
    
    const simulateMovement = setInterval(() => {
      setRiderLocation(prev => {
        const latDiff = customerLocation.lat - prev.lat;
        const lngDiff = customerLocation.lng - prev.lng;
        
        return {
          lat: prev.lat + latDiff * 0.1,
          lng: prev.lng + lngDiff * 0.1
        };
      });
    }, 5000);
    
    return () => clearInterval(simulateMovement);
  }, [rider, customerLocation]);

  return {
    customerLocation,
    riderLocation
  };
};
