'use server'

import { Client, PlaceAutocompleteType, AddressType } from "@googlemaps/google-maps-services-js";
import type { PlacePrediction, PlaceDetails } from "@/types/google-maps";

const client = new Client({});

export async function getPlacePredictions(input: string): Promise<{ predictions: PlacePrediction[]; status: string }> {
  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        types: PlaceAutocompleteType.address,
        components: ["country:us"],
        key: process.env.GOOGLE_MAPS_API_KEY || "",
      },
    });

    return {
      predictions: response.data.predictions,
      status: response.data.status,
    };
  } catch (error) {
    console.error('Error fetching place predictions:', error);
    throw new Error('Failed to fetch address suggestions');
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: [
          "address_components",
          "geometry",
          "formatted_address",
          "types",
          "name",
          "place_id"
        ],
        key: process.env.GOOGLE_MAPS_API_KEY || "",
      },
    });

    if (response.data.result) {
      const place = response.data.result;
      
      if (!place.place_id || !place.geometry) {
        throw new Error('Missing required place details');
      }

      // Extract structured address components
      const addressComponents = {
        streetNumber: "",
        route: "",
        city: "",
        state: "",
        zipCode: "",
      };

      place.address_components?.forEach(component => {
        if (component.types.includes(AddressType.street_number)) {
          addressComponents.streetNumber = component.long_name;
        }
        if (component.types.includes(AddressType.route)) {
          addressComponents.route = component.long_name;
        }
        if (component.types.includes(AddressType.locality)) {
          addressComponents.city = component.long_name;
        }
        if (component.types.includes(AddressType.administrative_area_level_1)) {
          addressComponents.state = component.short_name;
        }
        if (component.types.includes(AddressType.postal_code)) {
          addressComponents.zipCode = component.long_name;
        }
      });

      return {
        place_id: place.place_id,
        formatted_address: place.formatted_address ?? "",
        address_components: place.address_components ?? [],
        geometry: place.geometry,
        types: place.types ?? [],
        structured_address: addressComponents,
      };
    }

    throw new Error('Place details not found');
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw new Error('Failed to fetch place details');
  }
}
