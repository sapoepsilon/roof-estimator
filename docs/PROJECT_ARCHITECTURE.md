# Project Architecture Guidelines

[Content moved from GUIDELINES.md]

## TypeScript Types

This project uses TypeScript to ensure type safety and improve code maintainability. Follow these guidelines for type definitions:

### Type Definitions

1. Always define explicit types for:
   - Function parameters and return types
   - Component props
   - State variables
   - API responses
   - Redux store slices

2. Use interfaces for object shapes that represent a fixed structure:
   ```typescript
   interface RoofDetails {
     area: number;
     pitch: number;
     materials: string[];
   }
   ```

3. Use type aliases for unions, intersections, or simple types:
   ```typescript
   type Status = 'idle' | 'loading' | 'success' | 'error';
   ```

### Best Practices

1. Avoid using `any` type - it defeats the purpose of TypeScript
2. Use generics when creating reusable components or functions
3. Keep type definitions close to where they're used
4. Export types that are used across multiple files
5. Use strict mode (`"strict": true` in tsconfig.json)

### Type Organization

- Place shared types in `src/types` directory
- Co-locate component-specific types in the same file as the component
- Use barrel exports (index.ts) for commonly used types
