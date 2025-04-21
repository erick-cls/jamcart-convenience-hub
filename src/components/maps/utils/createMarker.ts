
export function createMarker({
  map,
  position,
  title,
  initials,
  color = "#3b82f6", // default blue color
  infoWindowContent,
}: {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  title: string;
  initials?: string;
  color?: string;
  infoWindowContent?: string;
}) {
  if (!window.google || !window.google.maps) return null;

  try {
    // If initials are provided, create a custom marker with initials
    if (initials) {
      // Create a div element to render the custom marker
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker-element";
      markerElement.style.display = "none";
      document.body.appendChild(markerElement);

      // Render the custom marker SVG
      markerElement.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="${color}" />
          <text x="50%" y="50%" fill="white" font-family="sans-serif" font-weight="bold" font-size="14"
            text-anchor="middle" dominant-baseline="middle">${initials}</text>
        </svg>
      `;

      // Convert the SVG to an image URL
      const svgBlob = new Blob([markerElement.innerHTML], { type: "image/svg+xml" });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Clean up the temporary element
      document.body.removeChild(markerElement);

      const marker = new window.google.maps.Marker({
        position,
        map,
        title,
        icon: {
          url: svgUrl,
          size: new window.google.maps.Size(40, 40),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
      });

      // Release the blob URL when the page is unloaded
      window.addEventListener("unload", () => URL.revokeObjectURL(svgUrl));

      if (infoWindowContent) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoWindowContent,
        });
        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }

      return marker;
    } else {
      // Default marker behavior (without initials)
      const marker = new window.google.maps.Marker({
        position,
        map,
        title,
        icon: {
          url: `https://maps.google.com/mapfiles/ms/icons/${color === "#3b82f6" ? "blue" : "green"}-dot.png`,
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
  } catch (error) {
    console.error("Error creating marker:", error);
    return null;
  }
}
