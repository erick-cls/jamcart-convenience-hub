
export function createMarker({
  map,
  position,
  title,
  iconUrl,
  infoWindowContent,
}: {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  title: string;
  iconUrl: string;
  infoWindowContent: string;
}) {
  if (!window.google || !window.google.maps) return null;

  const marker = new window.google.maps.Marker({
    position,
    map,
    title,
    icon: {
      url: iconUrl,
    },
  });

  if (infoWindowContent) {
    const infoWindow = new window.google.maps.InfoWindow({
      content: infoWindowContent,
    });
    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  }
  return marker;
}
