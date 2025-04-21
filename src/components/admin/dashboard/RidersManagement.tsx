import { useState, useEffect } from "react";
import GoogleMap from "@/components/maps/GoogleMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { mockRiders } from "@/pages/admin/orders/mockData";
import { Rider } from "@/pages/admin/orders/types";

const RidersManagement = () => {
  const [riders, setRiders] = useState<Rider[]>(mockRiders);

  useEffect(() => {
    const interval = setInterval(() => {
      setRiders(prev =>
        prev.map(rider => ({
          ...rider,
          lat: rider.lat ? rider.lat + (Math.random() - 0.5) * 0.001 : 18.01 + Math.random() * 0.02,
          lng: rider.lng ? rider.lng + (Math.random() - 0.5) * 0.001 : -76.81 + Math.random() * 0.02,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const firstLocation = riders.length
    ? { lat: riders[0].lat || 18.0179, lng: riders[0].lng || -76.8099 }
    : { lat: 18.0179, lng: -76.8099 };

  const riderLocations =
    riders
      .filter(r => typeof r.lat === "number" && typeof r.lng === "number")
      .map(r => ({
        lat: r.lat as number,
        lng: r.lng as number,
        name: r.name
      }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riders Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-[300px] w-full">
          <GoogleMap
            riderLocations={riderLocations}
            riderLocation={firstLocation}
            riderName={riders[0]?.name || "Rider"}
            height="100%"
            showControls={false}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riders.map(rider => (
                <TableRow key={rider.id}>
                  <TableCell>{rider.name}</TableCell>
                  <TableCell>{rider.isAvailable ? "Available" : "Busy"}</TableCell>
                  <TableCell>
                    {rider.lat && rider.lng
                      ? `${rider.lat.toFixed(5)}, ${rider.lng.toFixed(5)}`
                      : "Unknown"}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${rider.isAvailable ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                      {rider.isAvailable ? "Yes" : "No"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RidersManagement;
