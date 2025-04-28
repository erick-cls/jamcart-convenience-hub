
interface VendorDisplayProps {
  vendorName: string;
  vendorEmail: string;
}

export const VendorDisplay = ({ vendorName, vendorEmail }: VendorDisplayProps) => (
  <div className="space-y-2">
    <p className="font-medium">{vendorName}</p>
    <p className="text-sm text-gray-500">{vendorEmail}</p>
  </div>
);
