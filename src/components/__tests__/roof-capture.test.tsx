import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { useLoadScript } from "@react-google-maps/api";
import html2canvas from "html2canvas";
import RoofCapture from "../roof-capture";
import { OpenAIVisionService } from "../../lib/openai-vision";

// Increase timeout for all tests in this file
jest.setTimeout(10000);

const CAPTURE_ANGLES = [0, 60, 120, 180, 240, 300];

// Mock useLoadScript hook
jest.mock("@react-google-maps/api", () => ({
  useLoadScript: jest.fn(),
}));

// Mock map instance
const mockMap = {
  setHeading: jest.fn(),
  setCenter: jest.fn(),
  setZoom: jest.fn(),
};

// Mock Google Maps
const mockGoogle = {
  maps: {
    Map: jest.fn(() => mockMap),
    LatLng: jest.fn(),
  },
};

// Make google available globally
beforeAll(() => {
  global.google = mockGoogle;
});

// Mock html2canvas
jest.mock("html2canvas", () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      toDataURL: () => "mock-image-url",
    })
  ),
}));

// Mock OpenAI Vision Service
jest.mock("../../lib/openai-vision", () => ({
  OpenAIVisionService: jest.fn().mockImplementation(() => ({
    analyzeRoofImage: jest.fn().mockResolvedValue({
      measurements: {
        area: 1000,
        perimeter: 130,
        pitch: 30,
        confidence: 0.85,
      },
    }),
  })),
}));

describe("RoofCapture", () => {
  const mockProps = {
    address: "123 Test St",
    lat: 37.7749,
    lng: -122.4194,
    onCapture: jest.fn(),
    onError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLoadScript as jest.Mock).mockReturnValue({
      isLoaded: true,
      loadError: null,
    });
  });

  it("renders loading state initially", () => {
    (useLoadScript as jest.Mock).mockReturnValue({
      isLoaded: false,
      loadError: null,
    });

    render(<RoofCapture {...mockProps} />);
    expect(screen.getByTestId("loading-map")).toBeInTheDocument();
  });

  it("initializes map with correct properties", async () => {
    render(<RoofCapture {...mockProps} />);

    expect(mockGoogle.maps.Map).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      expect.objectContaining({
        center: { lat: mockProps.lat, lng: mockProps.lng },
        zoom: 20,
        mapTypeId: "satellite",
        tilt: 45,
      })
    );
  });

  it("captures images from all angles when button is clicked", async () => {
    // Mock successful map load
    (useLoadScript as jest.Mock).mockReturnValue({
      isLoaded: true,
      loadError: null,
    });

    render(<RoofCapture {...mockProps} />);

    const captureButton = screen.getByRole("button", {
      name: /capture roof images/i,
    });

    // Mock successful image captures
    const mockImages = Array(CAPTURE_ANGLES.length).fill("mock-image-url");

    await act(async () => {
      fireEvent.click(captureButton);
      // Wait for all captures to complete
      await new Promise((resolve) =>
        setTimeout(resolve, CAPTURE_ANGLES.length * 1000)
      );
    });

    await waitFor(() => {
      // Verify that setHeading was called for each angle
      expect(mockMap.setHeading).toHaveBeenCalledTimes(CAPTURE_ANGLES.length);
      CAPTURE_ANGLES.forEach((angle) => {
        expect(mockMap.setHeading).toHaveBeenCalledWith(angle);
      });

      // Verify that onCapture was called with images and measurements
      expect(mockProps.onCapture).toHaveBeenCalledWith(
        mockImages,
        expect.objectContaining({
          area: 1000,
          perimeter: 130,
          pitch: 30,
          confidence: 0.85,
        })
      );
    });
  });

  it("handles capture errors gracefully", async () => {
    // Mock html2canvas to throw an error
    (html2canvas as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Failed to capture image");
    });

    render(<RoofCapture {...mockProps} />);
    const captureButton = screen.getByRole("button", {
      name: /capture roof images/i,
    });

    await act(async () => {
      fireEvent.click(captureButton);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    expect(mockProps.onError).toHaveBeenCalledWith(
      "Failed to capture or analyze images: Error: Failed to capture image"
    );
  });

  it("captures images and analyzes roof when button is clicked", async () => {
    // Mock successful map load
    (useLoadScript as jest.Mock).mockReturnValue({
      isLoaded: true,
      loadError: null,
    });

    render(<RoofCapture {...mockProps} />);

    const captureButton = screen.getByRole("button", {
      name: /capture roof images/i,
    });

    await act(async () => {
      fireEvent.click(captureButton);
      // Wait for all captures to complete
      await new Promise((resolve) =>
        setTimeout(resolve, CAPTURE_ANGLES.length * 1000)
      );
    });

    // Wait for the analysis to complete
    await waitFor(() => {
      expect(screen.getByText(/analyzing roof/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      // Verify that onCapture was called with images and measurements
      expect(mockProps.onCapture).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          area: 1000,
          perimeter: 130,
          pitch: 30,
          confidence: 0.85,
        })
      );
    });
  });

  it("handles OpenAI Vision analysis errors gracefully", async () => {
    // Mock OpenAI Vision Service to throw an error
    const mockError = "Failed to analyze roof image";
    (OpenAIVisionService as jest.Mock).mockImplementation(() => ({
      analyzeRoofImage: jest.fn().mockRejectedValue(new Error(mockError)),
    }));

    render(<RoofCapture {...mockProps} />);
    const captureButton = screen.getByRole("button", {
      name: /capture roof images/i,
    });

    await act(async () => {
      fireEvent.click(captureButton);
      await new Promise((resolve) =>
        setTimeout(resolve, CAPTURE_ANGLES.length * 1000)
      );
    });

    await waitFor(() => {
      expect(mockProps.onError).toHaveBeenCalledWith(
        `Failed to capture or analyze images: Error: ${mockError}`
      );
    });
  });
});
