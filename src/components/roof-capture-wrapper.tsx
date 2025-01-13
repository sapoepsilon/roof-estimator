'use client';

import { useState } from 'react';
import RoofCapture from './roof-capture';

interface RoofCaptureWrapperProps {
  address: string;
  lat: number;
  lng: number;
}

export default function RoofCaptureWrapper({ address, lat, lng }: RoofCaptureWrapperProps) {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = (capturedImages: string[]) => {
    setImages(capturedImages);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <RoofCapture
        address={address}
        lat={lat}
        lng={lng}
        onCapture={handleCapture}
        onError={handleError}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Roof view ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {`${index * 60}°`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
