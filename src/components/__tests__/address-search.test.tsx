import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AddressSearch } from "../address-search";

// Mock Google Maps API loading
jest.mock("@react-google-maps/api", () => ({
  useLoadScript: () => ({
    isLoaded: true,
    loadError: null,
  }),
}));

// Mock Google Maps Services
const mockPredictions = [
  {
    description: "123 Test Street, City, State",
    place_id: "test_place_id_1",
    structured_formatting: {
      main_text: "123 Test Street",
      secondary_text: "City, State",
    },
  },
];

const mockPlaceResult = {
  formatted_address: "123 Test Street, City, State",
  geometry: {
    location: {
      lat: () => 37.7749,
      lng: () => -122.4194,
    },
  },
};

// Mock Google Maps
const mockAutocompleteService = {
  getPlacePredictions: jest.fn((request, callback) => {
    callback(mockPredictions, "OK");
  }),
};

const mockPlacesService = {
  getDetails: jest.fn((request, callback) => {
    callback(mockPlaceResult, "OK");
  }),
};

const mockGoogle = {
  maps: {
    places: {
      AutocompleteService: jest.fn(() => mockAutocompleteService),
      PlacesService: jest.fn(() => mockPlacesService),
      PlacesServiceStatus: {
        OK: "OK",
      },
    },
  },
};

describe("AddressSearch", () => {
  beforeAll(() => {
    global.google = mockGoogle;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input field", () => {
    render(<AddressSearch />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("handles user input and shows predictions", async () => {
    const onSelect = jest.fn();
    render(<AddressSearch onSelect={onSelect} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123 Test" } });

    await waitFor(() => {
      expect(mockAutocompleteService.getPlacePredictions).toHaveBeenCalled();
    });

    const prediction = await screen.findByText("123 Test Street, City, State");
    expect(prediction).toBeInTheDocument();
  });

  it("selects an address and triggers onSelect callback", async () => {
    const onSelect = jest.fn();
    render(<AddressSearch onSelect={onSelect} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123 Test" } });

    await waitFor(() => {
      expect(mockAutocompleteService.getPlacePredictions).toHaveBeenCalled();
    });

    const prediction = await screen.findByText("123 Test Street, City, State");
    fireEvent.click(prediction);

    await waitFor(() => {
      expect(mockPlacesService.getDetails).toHaveBeenCalled();
    });

    expect(onSelect).toHaveBeenCalledWith(mockPlaceResult);
  });

  it("handles errors gracefully", async () => {
    // Temporarily override the mock to simulate an error
    mockAutocompleteService.getPlacePredictions.mockImplementationOnce(
      (request, callback) => {
        callback(null, "ERROR");
      }
    );

    render(<AddressSearch />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123 Test" } });

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch address suggestions")
      ).toBeInTheDocument();
    });
  });

  it("shows roof capture component when address is selected", async () => {
    render(<AddressSearch />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123 Test" } });

    await waitFor(() => {
      expect(mockAutocompleteService.getPlacePredictions).toHaveBeenCalled();
    });

    const prediction = await screen.findByText("123 Test Street, City, State");
    fireEvent.click(prediction);

    await waitFor(() => {
      expect(mockPlacesService.getDetails).toHaveBeenCalled();
    });

    expect(screen.getByText(/Find Satellite Images/i)).toBeInTheDocument();
  });
});
