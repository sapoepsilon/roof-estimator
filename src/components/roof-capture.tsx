"use client";

import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import html2canvas from "html2canvas";
import { analyzeRoofImage, RoofMeasurements } from "@/app/actions/analyze-roof";

interface RoofCaptureProps {
  address: string;
  lat: number;
  lng: number;
  onCapture: (images: string[], measurements?: RoofMeasurements) => void;
  onError: (error: string) => void;
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
}: RoofCaptureProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleCaptureAll = async () => {
    if (!isMounted || !map || !mapRef.current) {
      onError("Map is not ready for capture");
      return;
    }

    try {
      setIsAnalyzing(true);
      const newImages: string[] = [];
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
      }

      try {
        // Analyze the best image (front view) using server action
        const bestImage = newImages[0]; // Using first image (0° angle) for analysis
        const base64Image = bestImage.split(",")[1];
        const analysisResult = await analyzeRoofImage(base64Image);

        if (analysisResult.error) {
          throw new Error(analysisResult.error);
        }

        // Call onCapture with both images and measurements
        onCapture(newImages, analysisResult.measurements);
        setCapturedImages(newImages);
      } catch (analysisError) {
        throw new Error(
          analysisError instanceof Error
            ? analysisError.message
            : "Analysis failed"
        );
      }
    } catch (error) {
      onError(`Failed to capture or analyze images: ${error}`);
    } finally {
      setIsAnalyzing(false);
    }
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
      <h2 className="text-xl font-semibold">Roof Capture for {address}</h2>
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
    </div>
  );
}
