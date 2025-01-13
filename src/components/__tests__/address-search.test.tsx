import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AddressSearch } from "../address-search";
import {
  getPlacePredictions,
  getPlaceDetails,
} from "@/app/actions/google-maps";

// Mock the server actions
jest.mock("@/app/actions/google-maps", () => ({
  getPlacePredictions: jest.fn().mockResolvedValue({
    predictions: [
      {
        description: "123 Test Street, City, State",
        place_id: "test_place_id_1",
        structured_formatting: {
          main_text: "123 Test Street",
          secondary_text: "City, State",
        },
        types: ["street_address"],
      },
    ],
    status: "OK",
  }),
  getPlaceDetails: jest.fn().mockResolvedValue({
    place_id: "test_place_id_1",
    formatted_address: "123 Test Street, City, State",
    address_components: [
      {
        long_name: "123",
        short_name: "123",
        types: ["street_number"],
      },
      {
        long_name: "Test Street",
        short_name: "Test St",
        types: ["route"],
      },
    ],
    geometry: {
      location: {
        lat: 37.7749,
        lng: -122.4194,
      },
    },
    types: ["street_address"],
    structured_address: {
      streetNumber: "123",
      route: "Test Street",
      city: "City",
      state: "State",
      zipCode: "12345",
    },
  }),
}));

describe("AddressSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input field", () => {
    render(<AddressSearch />);
    expect(
      screen.getByPlaceholderText("Enter an address...")
    ).toBeInTheDocument();
  });

  it("handles user input and shows predictions", async () => {
    render(<AddressSearch />);

    const input = screen.getByPlaceholderText("Enter an address...");
    fireEvent.change(input, { target: { value: "123 Test" } });

    await waitFor(() => {
      expect(getPlacePredictions).toHaveBeenCalledWith("123 Test");
    });

    await waitFor(() => {
      expect(
        screen.getByText("123 Test Street, City, State")
      ).toBeInTheDocument();
    });
  });

  it("selects an address and triggers onSelect callback", async () => {
    const onSelect = jest.fn();
    render(<AddressSearch onSelect={onSelect} />);

    const input = screen.getByPlaceholderText("Enter an address...");
    fireEvent.change(input, { target: { value: "123 Test" } });

    await waitFor(() => {
      expect(
        screen.getByText("123 Test Street, City, State")
      ).toBeInTheDocument();
    });

    const prediction = screen.getByText("123 Test Street, City, State");
    fireEvent.click(prediction);

    await waitFor(() => {
      expect(getPlaceDetails).toHaveBeenCalledWith("test_place_id_1");
    });

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          place_id: "test_place_id_1",
          formatted_address: "123 Test Street, City, State",
          address_components: expect.arrayContaining([
            expect.objectContaining({ types: ["street_number"] }),
            expect.objectContaining({ types: ["route"] }),
          ]),
        })
      );
    });
  });

  it("shows error for incomplete address", async () => {
    // Mock getPlaceDetails to return an incomplete address
    (getPlaceDetails as jest.Mock).mockResolvedValueOnce({
      place_id: "test_place_id_2",
      formatted_address: "Test City, State",
      address_components: [
        {
          long_name: "Test City",
          short_name: "Test City",
          types: ["locality"],
        },
      ],
      geometry: {
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
      },
    });

    render(<AddressSearch />);

    const input = screen.getByPlaceholderText("Enter an address...");
    fireEvent.change(input, { target: { value: "123 Test" } });

    await waitFor(() => {
      expect(
        screen.getByText("123 Test Street, City, State")
      ).toBeInTheDocument();
    });

    const prediction = screen.getByText("123 Test Street, City, State");
    fireEvent.click(prediction);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a complete street address")
      ).toBeInTheDocument();
    });
  });
});
