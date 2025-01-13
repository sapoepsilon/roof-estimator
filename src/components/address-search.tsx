"use client";

import * as React from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import RoofCapture from "./roof-capture";

interface AddressSearchProps {
  onSelect?: (address: google.maps.places.PlaceResult) => void;
  onCaptureComplete?: (images: string[]) => void;
}

export function AddressSearch({
  onSelect,
  onCaptureComplete,
}: AddressSearchProps) {
  const [input, setInput] = React.useState("");
  const [predictions, setPredictions] = React.useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = React.useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [showRoofCapture, setShowRoofCapture] = React.useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  const autocompleteService =
    React.useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = React.useRef<google.maps.places.PlacesService | null>(
    null
  );

  React.useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  // Separate useEffect for PlacesService initialization on client only
  React.useEffect(() => {
    if (typeof window !== "undefined" && isLoaded && !placesService.current) {
      const placesDiv = document.createElement("div");
      placesService.current = new google.maps.places.PlacesService(placesDiv);
    }
  }, [isLoaded]);

  const fetchPredictions = useDebouncedCallback((input: string) => {
    if (!input || !autocompleteService.current) return;

    setLoading(true);
    setError(null);

    autocompleteService.current.getPlacePredictions(
      {
        input,
        types: ["address"],
        componentRestrictions: { country: "us" },
      },
      (predictions, status) => {
        setLoading(false);

        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          setError("Failed to fetch address suggestions");
          setPredictions([]);
          return;
        }

        setPredictions(predictions || []);
      }
    );
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

  const handlePredictionSelect = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["address_components", "geometry", "formatted_address"],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          onSelect?.(place);
          setInput(place.formatted_address || "");
          setPredictions([]);

          if (place.geometry?.location) {
            setSelectedPlace({
              address: place.formatted_address || "",
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        }
      }
    );
  };

  if (loadError) {
    return <div className="text-red-500">Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div className="animate-pulse">Loading...</div>;
  }

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
            onCapture={(images) => {
              onCaptureComplete?.(images);
              setShowRoofCapture(false);
            }}
            onError={(error) => {
              setError(error);
              setShowRoofCapture(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
