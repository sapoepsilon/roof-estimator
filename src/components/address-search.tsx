"use client";

import * as React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import RoofCapture from "./roof-capture";
import {
  getPlacePredictions,
  getPlaceDetails,
} from "@/app/actions/google-maps";
import type { PlacePrediction, PlaceDetails } from "@/types/google-maps";

interface AddressSearchProps {
  onSelect?: (place: PlaceDetails) => void;
  onCaptureComplete?: (images: string[]) => void;
}

export function AddressSearch({
  onSelect,
  onCaptureComplete,
}: AddressSearchProps) {
  const [input, setInput] = React.useState("");
  const [predictions, setPredictions] = React.useState<PlacePrediction[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = React.useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [showRoofCapture, setShowRoofCapture] = React.useState(false);

  const fetchPredictions = useDebouncedCallback(async (input: string) => {
    if (!input) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getPlacePredictions(input);
      setPredictions(result.predictions || []);
    } catch (error) {
      console.error("Error fetching place predictions:", error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 2) {
      fetchPredictions(value);
    } else {
      setPredictions([]);
    }
  };

  const handlePredictionSelect = async (prediction: PlacePrediction) => {
    try {
      const place = await getPlaceDetails(prediction.place_id);

      // Validate if this is a valid address
      const hasStreetNumber = place.address_components?.some((component) =>
        component.types.includes("street_number")
      );
      const hasRoute = place.address_components?.some((component) =>
        component.types.includes("route")
      );

      if (!hasStreetNumber || !hasRoute) {
        setError("Please enter a complete street address");
        return;
      }

      onSelect?.(place);
      setInput(place.formatted_address || "");
      setPredictions([]);

      if (place.geometry?.location) {
        setSelectedPlace({
          address: place.formatted_address || "",
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        });
      }
    } catch (error) {
      setError(`Error fetching address details: ${error}`);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Enter an address..."
        value={input}
        onChange={handleInputChange}
        className="w-full"
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
        </div>
      )}

      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

      {predictions.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => handlePredictionSelect(prediction)}
            >
              {prediction.description}
            </div>
          ))}
        </div>
      )}

      {selectedPlace && !showRoofCapture && (
        <div className="mt-4">
          <Button onClick={() => setShowRoofCapture(true)} className="w-full">
            Find Satellite Images
          </Button>
        </div>
      )}

      {showRoofCapture && selectedPlace && (
        <div className="mt-4">
          <RoofCapture
            address={selectedPlace.address}
            lat={selectedPlace.lat}
            lng={selectedPlace.lng}
            onCapture={(images, measurements) => {
              onCaptureComplete?.(images);
              console.log("Captured images:", images);
              console.log("Measurements:", measurements);
            }}
            onError={setError}
            onClose={() => setShowRoofCapture(false)}
          />
        </div>
      )}
    </div>
  );
}
