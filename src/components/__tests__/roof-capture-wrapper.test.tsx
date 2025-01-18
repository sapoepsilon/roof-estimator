// import { render, screen, act } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import RoofCaptureWrapper from "../roof-capture-wrapper";

// // Mock the RoofCapture component
// jest.mock("../roof-capture", () => {
//   return function MockRoofCapture({ onCapture, onError }: any) {
//     return (
//       <div data-testid="mock-roof-capture">
//         <button
//           onClick={() => {
//             act(() => {
//               onCapture(["test-image-1", "test-image-2"]);
//             });
//           }}
//         >
//           Capture
//         </button>
//         <button
//           onClick={() => {
//             act(() => {
//               onError("Test error");
//             });
//           }}
//         >
//           Trigger Error
//         </button>
//       </div>
//     );
//   };
// });

// describe("RoofCaptureWrapper", () => {
//   const mockProps = {
//     address: "123 Test St",
//     lat: 37.7749,
//     lng: -122.4194,
//   };

//   it("renders RoofCapture component with correct props", () => {
//     render(<RoofCaptureWrapper {...mockProps} />);
//     expect(screen.getByTestId("mock-roof-capture")).toBeInTheDocument();
//   });

//   it("displays captured images when available", async () => {
//     render(<RoofCaptureWrapper {...mockProps} />);

//     // Trigger image capture
//     await act(async () => {
//       screen.getByText("Capture").click();
//     });

//     // Check if images are rendered
//     const images = screen.getAllByRole("img");
//     expect(images).toHaveLength(2);
//     expect(images[0]).toHaveAttribute("src", "test-image-1");
//     expect(images[1]).toHaveAttribute("src", "test-image-2");
//   });

//   it("displays error message when error occurs", async () => {
//     render(<RoofCaptureWrapper {...mockProps} />);

//     // Trigger error
//     await act(async () => {
//       screen.getByText("Trigger Error").click();
//     });

//     expect(screen.getByText("Test error")).toBeInTheDocument();
//   });

//   it("clears error when new images are captured", async () => {
//     render(<RoofCaptureWrapper {...mockProps} />);

//     // Trigger error first
//     await act(async () => {
//       screen.getByText("Trigger Error").click();
//     });
//     expect(screen.getByText("Test error")).toBeInTheDocument();

//     // Then capture images
//     await act(async () => {
//       screen.getByText("Capture").click();
//     });
//     expect(screen.queryByText("Test error")).not.toBeInTheDocument();
//   });
// });
