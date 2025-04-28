
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import GoogleMap from '@/components/maps/GoogleMap';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  status: string;
  orders: number;
  lat?: number;
  lng?: number;
}

interface RecentUsersProps {
  users: User[];
}

// Check if a test API key is needed
const ensureApiKey = () => {
  try {
    const savedKeys = localStorage.getItem("apiKeys");
    if (!savedKeys) {
      // Set a test API key if none exists
      const testApiKey = {
        googleMaps: "AIzaSyA6vF-6SZ8HX_2kCK0BK0OX2PP6hIhyH6E" // Test key
      };
      localStorage.setItem('apiKeys', JSON.stringify(testApiKey));
      return true;
    }
    
    const parsedKeys = JSON.parse(savedKeys);
    if (!parsedKeys.googleMaps) {
      parsedKeys.googleMaps = "AIzaSyA6vF-6SZ8HX_2kCK0BK0OX2PP6hIhyH6E"; // Test key
      localStorage.setItem('apiKeys', JSON.stringify(parsedKeys));
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error checking API keys:", e);
    return false;
  }
};

const RecentUsers = ({ users }: RecentUsersProps) => {
  const navigate = useNavigate();
  const [mapError, setMapError] = useState(false);
  
  // Ensure API key exists when component mounts
  useEffect(() => {
    const keyAdded = ensureApiKey();
    if (keyAdded) {
      console.log("Added test API key for Google Maps");
    }
  }, []);
  
  const handleViewAll = () => {
    navigate('/admin/users');
  };

  const handleMapError = () => {
    setMapError(true);
    toast({
      title: "Map loading failed",
      description: "Check API key in Admin Settings",
      variant: "destructive",
    });
  };

  // Filter users with valid coordinates for the map
  const usersWithLocations = users
    .filter(user => typeof user.lat === 'number' && typeof user.lng === 'number')
    .map(user => ({
      lat: user.lat as number,
      lng: user.lng as number,
      name: user.name
    }));
  
  // Add default locations if none exist
  const ensureLocations = (locations: any[]) => {
    if (locations.length === 0) {
      // Add default locations in Jamaica
      return [
        { lat: 18.0179, lng: -76.8099, name: "Kingston" },
        { lat: 18.0300, lng: -76.7900, name: "User 1" },
        { lat: 18.0350, lng: -76.8200, name: "User 2" }
      ];
    }
    return locations;
  };
  
  const mapLocations = ensureLocations(usersWithLocations);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Recent Users</h2>
        <button
          className="text-sm text-jamcart-green flex items-center"
          onClick={handleViewAll}
        >
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Map Display */}
      <div className="p-4 border-b border-gray-100">
        <div className="h-[200px] w-full rounded-lg overflow-hidden">
          <GoogleMap
            riderLocations={mapLocations}
            height="200px"
            zoom={12}
            showControls={false}
            onError={handleMapError}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.dateJoined).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.orders}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentUsers;
