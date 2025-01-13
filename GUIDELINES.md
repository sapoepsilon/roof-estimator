# Roof Estimator Pro Guidelines

Welcome to the Roof Estimator Pro guidelines. Find your scenario below and follow the linked documentation.

## Common Scenarios

### "I want to..."

#### Create New Features
- **"I need to add a new page or component"**
  → [Component Guidelines](./docs/COMPONENT_GUIDELINES.md)
  
- **"I need to integrate with Google Maps or create an API"**
  → [API Guidelines](./docs/API_GUIDELINES.md)
  
- **"I need to write tests"**
  → [Testing Guidelines](./docs/TESTING_GUIDELINES.md)

#### Modify Existing Code
- **"I need to update an existing component"**
  → [Component Guidelines](./docs/COMPONENT_GUIDELINES.md)
  
- **"I need to modify API integration"**
  → [API Guidelines](./docs/API_GUIDELINES.md)
  
- **"I need to fix or update tests"**
  → [Testing Guidelines](./docs/TESTING_GUIDELINES.md)

#### Architecture & Planning
- **"I need to understand the project structure"**
  → [Project Architecture](./docs/PROJECT_ARCHITECTURE.md)
  
- **"I need to make architectural decisions"**
  → [Master Guidelines](./docs/MASTER_GUIDELINES.md)

### Quick Reference

#### Frontend Tasks
- Address Search Implementation
  1. [Component Guidelines](./docs/COMPONENT_GUIDELINES.md) - UI Components
  2. [API Guidelines](./docs/API_GUIDELINES.md) - Google Places Integration
  3. [Testing Guidelines](./docs/TESTING_GUIDELINES.md) - Component Testing

#### Backend Tasks
- Roof Analysis Features
  1. [API Guidelines](./docs/API_GUIDELINES.md) - API Design
  2. [Component Guidelines](./docs/COMPONENT_GUIDELINES.md) - Data Display
  3. [Testing Guidelines](./docs/TESTING_GUIDELINES.md) - API Testing

#### Testing Tasks
- Test Implementation
  1. [Testing Guidelines](./docs/TESTING_GUIDELINES.md) - Test Strategy
  2. Relevant feature guidelines (Component/API)

## Need More Help?

If your scenario isn't listed above:
1. Check [Master Guidelines](./docs/MASTER_GUIDELINES.md) for decision trees
2. Follow the most relevant path
3. Consult team leads if needed

## Contributing

To update these guidelines:
1. Follow [Master Guidelines](./docs/MASTER_GUIDELINES.md) contribution process
2. Submit changes via pull request
3. Update this file if adding new common scenarios

## Project Overview
This document outlines the architecture and best practices for our Next.js 15 application with TypeScript and ESLint integration.

## Tech Stack
- Next.js 15
- TypeScript 5
- React 19
- ESLint 9
- TailwindCSS 3.4
- Node.js 20+

## Project Structure
```
src/
├── app/             # App router components and layouts
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/            # Utility functions and services
├── types/          # TypeScript type definitions
└── tests/          # Test files
```

## Coding Standards

### TypeScript
- Enable strict mode in `tsconfig.json`
- Use explicit type annotations for function parameters and returns
- Create dedicated type definitions in `src/types`
- Use interfaces for object shapes and types for unions/primitives

Example:
```typescript
interface RoofDimensions {
  length: number;
  width: number;
  pitch: number;
}

type RoofType = 'gable' | 'hip' | 'flat';
```

### ESLint Configuration
We use the Next.js ESLint configuration with additional rules:
- `eslint-config-next`
- Strict TypeScript checks
- No unused variables/imports
- Consistent type definitions
- Proper React Hooks usage

### Component Architecture

#### Smart Components
- Located in `src/app` directory
- Handle data fetching and state management
- Use React Server Components where possible
- Implement error boundaries

#### Presentational Components
- Located in `src/components`
- Pure UI rendering
- Accept props with proper TypeScript interfaces
- Implement proper accessibility attributes

### State Management
1. Use React Server Components for server-side state
2. Implement React hooks for client-side state
3. Consider Zustand/Jotai for complex state management

### Testing Strategy

#### Unit Tests
- Use Jest for unit testing
- Test utilities and hooks
- Maintain 80%+ coverage for utility functions

```typescript
// Example test structure
describe('calculateRoofArea', () => {
  it('should calculate area correctly for gable roof', () => {
    // Test implementation
  });
});
```

#### Component Tests
- Use React Testing Library
- Test component rendering and interactions
- Focus on user-centric behavior

#### E2E Tests
- Use Playwright for E2E testing
- Cover critical user flows
- Test on multiple browsers

### Performance Guidelines
1. Implement proper image optimization
2. Use Next.js built-in performance features:
   - Image optimization
   - Font optimization
   - Static and dynamic imports
3. Implement proper loading states
4. Use React Suspense boundaries

### API Integration
1. Create type-safe API clients
2. Implement proper error handling
3. Use environment variables for sensitive data
4. Implement request caching where appropriate

### Security Best Practices
1. Validate all user inputs
2. Implement proper CORS policies
3. Use environment variables for sensitive data
4. Regular dependency updates
5. Implement rate limiting

### Git Workflow
1. Branch naming convention:
   - feature/feature-name
   - fix/bug-name
   - chore/task-name

2. Commit message format:
   ```
   type(scope): description
   
   [optional body]
   ```

3. Pull request requirements:
   - Passing tests
   - No ESLint errors
   - Type-check passes
   - Code review approval

### Documentation
1. Use JSDoc for component and function documentation
2. Maintain up-to-date README.md
3. Document all environment variables
4. Keep CHANGELOG.md updated

### Deployment
1. Use Vercel for deployments
2. Implement proper environment configurations
3. Use deployment previews for PRs
4. Maintain staging environment

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] ESLint passes without errors
- [ ] Tests are included and passing
- [ ] Performance implications considered
- [ ] Accessibility requirements met
- [ ] Security best practices followed
- [ ] Documentation updated

### Development Environment Setup
1. Required tools:
   - Node.js 20+
   - npm/yarn/pnpm
   - Git
   
2. Environment variables:
   ```
   NEXT_PUBLIC_API_URL=
   NEXT_PUBLIC_GOOGLE_MAPS_KEY=
   ```

3. Getting started:
   ```bash
   npm install
   npm run dev
   ```

### Accessibility Standards
1. Use semantic HTML
2. Implement ARIA attributes
3. Ensure keyboard navigation
4. Maintain color contrast ratios
5. Test with screen readers

### Performance Metrics
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

## Maintenance
1. Regular dependency updates (weekly)
2. Performance monitoring
3. Error tracking
4. Analytics implementation
5. Regular security audits
