export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface StructuredAddress {
  streetNumber: string;
  route: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
}

export interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: Geometry;
  types: string[];
  structured_address: StructuredAddress;
}
