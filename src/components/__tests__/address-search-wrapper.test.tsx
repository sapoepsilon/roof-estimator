import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddressSearchWrapper } from '../address-search-wrapper';

// Mock AddressSearch component
jest.mock('../address-search', () => ({
  AddressSearch: jest.fn(() => (
    <div>
      <div data-testid="loading-state" className="animate-pulse">Loading...</div>
      <div data-testid="mock-address-search">Address Search Component</div>
    </div>
  ))
}));

describe('AddressSearchWrapper', () => {
  it('shows loading state initially', () => {
    render(<AddressSearchWrapper />);
    const loadingElement = screen.getByTestId('loading-state');
    expect(loadingElement).toHaveClass('animate-pulse');
  });

  it('renders AddressSearch component after mounting', async () => {
    render(<AddressSearchWrapper />);
    
    // Wait for component to mount
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId('mock-address-search')).toBeInTheDocument();
  });

  it('handles console logging on place selection', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<AddressSearchWrapper />);
    
    // Wait for component to mount
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Get the mocked AddressSearch component
    const { AddressSearch } = require('../address-search');
    const mockOnSelect = AddressSearch.mock.calls[0][0].onSelect;
    
    const mockPlace = { formatted_address: '123 Test St' };
    mockOnSelect(mockPlace);

    expect(consoleSpy).toHaveBeenCalledWith('Selected place:', mockPlace);
    consoleSpy.mockRestore();
  });
});
