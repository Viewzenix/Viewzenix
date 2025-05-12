# Viewzenix Frontend

## Overview
This is the frontend application for the Viewzenix trading webhook platform, which enables automated trading by connecting TradingView alerts to broker APIs.

## Technology Stack
- **Framework**: Next.js with TypeScript
- **UI Library**: Chakra UI v3.17.0
- **State Management**: React Context API, custom hooks
- **API Integration**: Repository pattern with Supabase and REST implementations
- **Authentication**: Supabase JWT with HTTP-only cookies

## Project Structure
```
frontend/
├── app/                  # Next.js App Router pages and layouts
├── components/           # React components
│   ├── common/           # Reusable UI components
│   └── layout/           # Layout components (header, sidebar, etc.)
├── config/               # Configuration files and environment variables
├── hooks/                # Custom React hooks
├── repositories/         # Data access layer with repository pattern
├── services/             # Business logic and API services
├── styles/               # Global styles and theme configuration
└── types/                # TypeScript type definitions
```

## Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Guidelines
- Follow TypeScript strict mode practices
- Use the repository pattern for all data access
- Create reusable components in the components/common directory
- Implement proper error handling
- Ensure accessibility compliance
- Write unit tests for components and hooks

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint