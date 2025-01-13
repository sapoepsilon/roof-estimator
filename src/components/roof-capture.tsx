"use client";

import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import html2canvas from "html2canvas";
import { analyzeRoofImage, RoofMeasurements } from "@/app/actions/analyze-roof";
import { RoofResults } from "./roof-results";

interface RoofCaptureProps {
  address: string;
  lat: number;
  lng: number;
  onCapture: (images: string[], measurements?: RoofMeasurements) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

const CAPTURE_ANGLES = [0, 60, 120, 180, 240, 300]; // 6 different angles
const DEFAULT_ZOOM = 20;
const DEFAULT_TILT = 45;

export default function RoofCapture({
  address,
  lat,
  lng,
  onCapture,
  onError,
  onClose,
}: RoofCaptureProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [measurements, setMeasurements] = useState<RoofMeasurements>();
  const [analysisError, setAnalysisError] = useState<string>();

  // Handle client-side only mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  useEffect(() => {
    if (!isLoaded || loadError || !isMounted) return;

    try {
      if (!mapRef.current) {
        console.error("Map reference is not available");
        return;
      }

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: DEFAULT_ZOOM,
        mapTypeId: "satellite",
        tilt: DEFAULT_TILT,
        disableDefaultUI: true,
        gestureHandling: "greedy",
      });

      console.log("Map instance created successfully");
      setMap(mapInstance);
    } catch (error) {
      console.error("Error creating map instance:", error);
      onError(`Failed to create map instance: ${error}`);
    }
  }, [isLoaded, loadError, lat, lng, onError, isMounted]);

  useEffect(() => {
    if (loadError) {
      onError(loadError.message);
    }
  }, [loadError, onError]);

  useEffect(() => {
    setCapturedImages([]);
    setMeasurements(undefined);
  }, [address]);

  const handleCaptureAll = async () => {
    if (!isMounted || !map || !mapRef.current) {
      onError("Map is not ready for capture");
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisError(undefined);
      const newImages: string[] = [];
      console.log("Starting image capture...");
      
      // First capture all images
      for (const angle of CAPTURE_ANGLES) {
        map.setHeading(angle);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const canvas = await html2canvas(mapRef.current, {
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: false,
          logging: false,
          imageTimeout: 0,
          removeContainer: true,
        });

        const imageUrl = canvas.toDataURL();
        newImages.push(imageUrl);
        console.log(`Captured image at angle ${angle}`);
      }

      console.log("All images captured, setting state...");
      setCapturedImages(newImages);
      
      // Then analyze the best image
      console.log("Starting image analysis...");
      const bestImage = newImages[0];
      const base64Image = bestImage.split(",")[1];
      const analysisResult = await analyzeRoofImage(base64Image);

      if (analysisResult.error) {
        console.error("Analysis error:", analysisResult.error);
        setAnalysisError(analysisResult.error);
        return;
      }

      console.log("Analysis complete:", analysisResult.measurements);
      setMeasurements(analysisResult.measurements);
      // Call onCapture after a small delay to ensure state updates are complete
      setTimeout(() => {
        onCapture(newImages, analysisResult.measurements);
      }, 100);
    } catch (error) {
      console.error("Capture/analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setAnalysisError(errorMessage);
      onError(`Failed to capture or analyze images: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const CapturedImages = ({ images }: { images: string[] }) => {
    if (images.length === 0) return null;
    
    return (
      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.map((image, index) => (
          <div key={`${address}-${index}`} className="relative aspect-square">
            <img
              src={image}
              alt={`Roof view ${index}`}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        ))}
      </div>
    );
  };

  // Don't render anything during SSR
  if (!isMounted) {
    return null;
  }

  if (!isLoaded) {
    return <div data-testid="loading-map">Loading map...</div>;
  }

  if (loadError) {
    return <div>Error loading map: {loadError.message}</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Roof Capture for {address}</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close roof capture"
        >
          ✕
        </button>
      </div>
      <div
        ref={mapRef}
        className="h-96 w-full rounded-lg overflow-hidden shadow-lg"
      />
      <div className="flex justify-between items-center">
        <button
          onClick={handleCaptureAll}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={!isMounted || isAnalyzing}
        >
          {isAnalyzing ? "Analyzing Roof..." : "Capture Roof Images"}
        </button>
        <span className="text-sm text-gray-600">
          {capturedImages.length} of {CAPTURE_ANGLES.length} angles captured
        </span>
      </div>
      
      {/* Always show images if they exist */}
      {capturedImages.length > 0 && <CapturedImages images={capturedImages} />}
      
      {/* Show results with error state */}
      <RoofResults
        measurements={measurements}
        isLoading={isAnalyzing}
        error={analysisError}
      />
    </div>
  );
}
