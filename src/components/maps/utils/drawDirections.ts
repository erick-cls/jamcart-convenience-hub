
export function drawDirections({
  map,
  origin,
  destination,
}: {
  map: google.maps.Map;
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  if (!window.google || !window.google.maps) return;
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer({
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "#FFD700",
      strokeWeight: 5,
    },
  });

  directionsRenderer.setMap(map);

  directionsService.route(
    {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      }
    }
  );
}
