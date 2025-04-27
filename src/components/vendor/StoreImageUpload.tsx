
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { VendorStore } from '@/types/vendor.types';
import { RotateCw } from 'lucide-react';

interface StoreImageUploadProps {
  store: VendorStore;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

const StoreImageUpload = ({ store, onUpload, isUploading }: StoreImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };
  
  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };
  
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const renderImagePreview = () => {
    if (previewUrl) {
      return <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-md" />;
    } else if (store.imageUrl) {
      return <img src={store.imageUrl} alt={store.name} className="w-full h-40 object-cover rounded-md" />;
    } else {
      return (
        <div className="w-full h-40 bg-[#20a64f]/5 border border-[#20a64f]/20 rounded-md flex items-center justify-center">
          <p className="text-sm text-gray-400">No image uploaded</p>
        </div>
      );
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-white mb-2">Upload a store image (recommended size: 400px × 300px)</p>
      
      <div className="border border-[#20a64f]/20 rounded-md p-4">
        {renderImagePreview()}
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSelectFileClick}
            className="border-[#20a64f]/30 text-white hover:bg-[#20a64f]/10"
          >
            Select Image
          </Button>
          
          <Button
            type="button"
            onClick={handleUploadClick}
            disabled={!selectedFile || isUploading}
            className="bg-[#20a64f] hover:bg-[#20a64f]/80"
          >
            {isUploading ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : 'Upload Image'}
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {selectedFile && (
          <p className="text-sm text-gray-400 mt-2">
            Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        )}
      </div>
      
      <p className="text-xs text-gray-400">
        Image should be clear, professional, and represent your store well. Maximum size: 5MB.
      </p>
    </div>
  );
};

export default StoreImageUpload;
