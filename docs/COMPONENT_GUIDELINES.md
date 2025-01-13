# Component Architecture Guidelines

## Component Structure

### Directory Organization
```
components/
├── address/
│   ├── AddressSearch/
│   │   ├── index.tsx
│   │   ├── AddressSearch.test.tsx
│   │   └── types.ts
│   └── AddressDetails/
├── roof/
│   ├── RoofViewer/
│   ├── RoofMetrics/
│   └── RoofCalculator/
└── ui/
    ├── Button/
    ├── Input/
    └── Card/
```

## Component Patterns

### Smart Components
```typescript
// Example of a smart component
const AddressSearchContainer: React.FC = () => {
  const { searchAddress } = useAddressSearch();
  
  // Business logic implementation
  
  return <AddressSearchView {...props} />;
};
```

### Presentational Components
```typescript
// Example of a presentational component
interface AddressSearchViewProps {
  onSearch: (query: string) => void;
  results: Address[];
  isLoading: boolean;
}

const AddressSearchView: React.FC<AddressSearchViewProps> = ({
  onSearch,
  results,
  isLoading
}) => {
  // UI rendering only
};
```

## State Management

### Local State
Use local state for UI-specific state:
```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Complex State
Use custom hooks for complex state:
```typescript
const useAddressSearch = () => {
  // Implementation
};
```

## Component Best Practices

### Props Interface
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}
```

### Error Boundaries
```typescript
class ComponentErrorBoundary extends React.Component {
  // Implementation
}
```

## Performance Optimization

### Memoization
```typescript
const MemoizedComponent = React.memo(({ prop1, prop2 }) => {
  // Implementation
});
```

### Code Splitting
```typescript
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

## Accessibility

### ARIA Attributes
```typescript
const Button = ({ label, onClick }) => (
  <button
    aria-label={label}
    onClick={onClick}
    role="button"
  >
    {label}
  </button>
);
```

### Keyboard Navigation
1. Implement proper focus management
2. Use proper tab order
3. Handle keyboard events

## Component Testing

### Unit Tests
```typescript
describe('Button', () => {
  it('should handle click events', () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('AddressSearch', () => {
  it('should search and display results', async () => {
    // Test implementation
  });
});
```

## Documentation

### Component Documentation
```typescript
/**
 * AddressSearch component for looking up addresses using Google Places API
 * @param {Object} props - Component props
 * @param {Function} props.onSelect - Callback when address is selected
 * @param {boolean} props.autoFocus - Should input be focused on mount
 */
```

### Storybook Stories
```typescript
// Button.stories.tsx
export default {
  title: 'Components/Button',
  component: Button,
};
```

## Style Guidelines

### CSS Modules
```typescript
import styles from './Button.module.css';

const Button = () => (
  <button className={styles.button}>
    Click me
  </button>
);
```

### TailwindCSS
```typescript
const Card = () => (
  <div className="rounded-lg shadow-md p-4 bg-white">
    {/* Content */}
  </div>
);
```

## Error Handling

### Loading States
```typescript
const LoadingState = () => (
  <div role="status" aria-busy="true">
    Loading...
  </div>
);
```

### Error States
```typescript
const ErrorState = ({ message }) => (
  <div role="alert">
    {message}
  </div>
);
```
