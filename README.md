# Roof Estimator Pro

A modern Next.js application for accurate roof measurements and estimations using satellite imagery and Google Maps integration.

## Project Overview

Roof Estimator Pro is a professional-grade tool that helps contractors, solar installers, and property managers accurately measure and analyze roof dimensions. Using advanced satellite imagery and Google Maps integration, the application provides detailed roof measurements and property information.

### Key Features

- 🏠 Address lookup using Google Places API
- 🛰️ Satellite imagery integration
- 📏 Accurate roof measurements and area calculations
- 📊 Detailed property information
- 📱 Responsive design for all devices

## Tech Stack

- Next.js 15
- TypeScript
- TailwindCSS
- Google Maps/Places API
- ESLint
- Jest & React Testing Library

## Project Guidelines

This project follows strict development guidelines to ensure code quality and maintainability:

- [GUIDELINES.md](./GUIDELINES.md) - Main project guidelines and architecture
- [API_GUIDELINES.md](./docs/API_GUIDELINES.md) - API integration standards
- [COMPONENT_GUIDELINES.md](./docs/COMPONENT_GUIDELINES.md) - Component architecture and best practices
- [TESTING_GUIDELINES.md](./docs/TESTING_GUIDELINES.md) - Testing strategies and requirements

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/roof-estimator.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Google Maps API key:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
src/
├── app/             # Next.js app router components
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/            # Utility functions
├── types/          # TypeScript definitions
└── tests/          # Test files
```

## Contributing

Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting any pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
