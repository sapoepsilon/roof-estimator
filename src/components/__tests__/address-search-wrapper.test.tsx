// import { render, screen, act } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { AddressSearchWrapper } from '../address-search-wrapper';
// import { AddressSearch } from '../address-search';

// // Mock AddressSearch component
// jest.mock('../address-search', () => {
//   const mockComponent = jest.fn(() => (
//     <div>
//       <div data-testid="loading-state" className="animate-pulse">Loading...</div>
//       <div data-testid="mock-address-search">Address Search Component</div>
//     </div>
//   ));
//   return { AddressSearch: mockComponent };
// });

// // Add type assertion for mocked component
// const MockedAddressSearch = AddressSearch as jest.MockedFunction<typeof AddressSearch>;

// describe('AddressSearchWrapper', () => {
//   it('shows loading state initially', () => {
//     render(<AddressSearchWrapper />);
//     const loadingElement = screen.getByTestId('loading-state');
//     expect(loadingElement).toHaveClass('animate-pulse');
//   });

//   it('renders AddressSearch component after mounting', async () => {
//     render(<AddressSearchWrapper />);

//     // Wait for component to mount
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });

//     expect(screen.getByTestId('mock-address-search')).toBeInTheDocument();
//   });

//   it('handles console logging on place selection', async () => {
//     const consoleSpy = jest.spyOn(console, 'log');
//     render(<AddressSearchWrapper />);

//     // Wait for component to mount
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });

//     // Get the mocked AddressSearch component
//     const mockProps = MockedAddressSearch.mock.calls[0]?.[0];
//     expect(mockProps).toBeDefined();
//     expect(mockProps.onSelect).toBeDefined();

//     const mockPlace = { formatted_address: '123 Test St' };
//     mockProps.onSelect(mockPlace);

//     expect(consoleSpy).toHaveBeenCalledWith('Selected place:', mockPlace);
//     consoleSpy.mockRestore();
//   });
// });
