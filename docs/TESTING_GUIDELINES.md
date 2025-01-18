# Testing Guidelines

## Testing Strategy

### Test Types

1. **Unit Tests**
   - Individual component testing
   - Utility function testing
   - Hook testing

2. **Integration Tests**
   - Component interaction testing
   - API integration testing
   - State management testing

3. **E2E Tests**
   - Critical user flows
   - Cross-browser testing
   - Performance testing

## Test Structure

### Directory Organization
```
src/
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── components/
│   └── ComponentName/
│       ├── index.tsx
│       └── ComponentName.test.tsx
```

## Unit Testing

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('AddressSearch', () => {
  it('should render input field', () => {
    render(<AddressSearch />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should handle user input', async () => {
    render(<AddressSearch onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123 Main St' } });
    expect(mockOnSearch).toHaveBeenCalledWith('123 Main St');
  });
});
```

### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react-hooks';

describe('useAddressSearch', () => {
  it('should return search results', async () => {
    const { result } = renderHook(() => useAddressSearch());
    
    act(() => {
      result.current.search('123 Main St');
    });

    expect(result.current.results).toHaveLength(1);
  });
});
```

## Integration Testing

### API Integration
```typescript
describe('GooglePlacesAPI', () => {
  it('should fetch address details', async () => {
    const response = await fetchAddressDetails('place_id');
    expect(response).toHaveProperty('formatted_address');
  });
});
```

### Component Integration
```typescript
describe('RoofEstimator', () => {
  it('should calculate roof area after address selection', async () => {
    render(<RoofEstimator />);
    
    // Test implementation
  });
});
```

## E2E Testing

### User Flow Testing
```typescript
describe('Roof Estimation Flow', () => {
  it('should complete full estimation process', async () => {
    // Test implementation
  });
});
```

## Test Coverage

### Coverage Requirements
- Minimum 80% coverage for unit tests
- Critical paths must have 100% coverage
- E2E tests for main user flows

### Coverage Report
```bash
npm run test:coverage
```

## Mocking

### API Mocking
```typescript
jest.mock('../../lib/google/places', () => ({
  searchAddress: jest.fn().mockResolvedValue([
    // Mock data
  ])
}));
```

### Component Mocking
```typescript
jest.mock('../../components/Map', () => ({
  Map: () => <div data-testid="mock-map" />
}));
```

## Test Best Practices

### Naming Conventions
```typescript
describe('ComponentName', () => {
  it('should [expected behavior] when [condition]', () => {
    // Test implementation
  });
});
```

### Arrange-Act-Assert Pattern
```typescript
it('should update address when selected', () => {
  // Arrange
  const { getByRole } = render(<AddressSearch />);
  
  // Act
  fireEvent.click(getByRole('button'));
  
  // Assert
  expect(getByRole('textbox')).toHaveValue('123 Main St');
});
```

## Import Conventions

### Use ES6 Imports
Always use ES6 import statements instead of CommonJS `require()`. This ensures consistency with modern JavaScript practices and better TypeScript integration.

```typescript
// ✅ Good
import { Component } from './component';
import { render } from '@testing-library/react';

// ❌ Bad
const { Component } = require('./component');
const { render } = require('@testing-library/react');
```

## Performance Testing

### Metrics to Test
1. Component render time
2. API response time
3. User interaction latency

### Performance Test Example
```typescript
describe('Performance', () => {
  it('should render address search within 100ms', () => {
    const start = performance.now();
    render(<AddressSearch />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100);
  });
});
```

## Continuous Integration

### CI Pipeline
1. Run unit tests
2. Run integration tests
3. Generate coverage report
4. Run E2E tests
5. Performance benchmarking

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit",
      "pre-push": "npm run test:all"
    }
  }
}
