const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the frontend directory
const frontendDir = path.join(__dirname, 'frontend');

// Step 1: Create Next.js app
console.log('1. Creating Next.js app with TypeScript...');
try {
  // Remove existing frontend directory if it exists
  if (fs.existsSync(frontendDir)) {
    console.log('Removing existing frontend directory...');
    fs.rmSync(frontendDir, { recursive: true, force: true });
  }

  // Create new Next.js app with TypeScript
  execSync('npx create-next-app@latest frontend --typescript --eslint --no-tailwind --no-src-dir --app --import-alias=@/*', { 
    stdio: 'inherit' 
  });
  console.log('Next.js app created successfully!');
} catch (error) {
  console.error('Error creating Next.js app:', error);
  process.exit(1);
}

// Step 2: Install Chakra UI
console.log('\n2. Installing Chakra UI v3.17.0...');
try {
  execSync('cd frontend && npm install @chakra-ui/react@3.17.0 @chakra-ui/next-js@3.1.1 @emotion/react @emotion/styled framer-motion', {
    stdio: 'inherit'
  });
  console.log('Chakra UI installed successfully!');
} catch (error) {
  console.error('Error installing Chakra UI:', error);
  process.exit(1);
}

// Step 3: Create feature-based folder structure
console.log('\n3. Creating folder structure...');
const folders = [
  'components',
  'components/common',
  'components/layout',
  'hooks',
  'services',
  'repositories',
  'config',
  'types',
  'styles',
];

folders.forEach(folder => {
  const folderPath = path.join(frontendDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created ${folder} directory`);
  }
});

// Step 4: Create README.md
console.log('\n4. Creating README.md...');
const readmeContent = `# Viewzenix Frontend

## Overview
This is the frontend application for the Viewzenix trading webhook platform, which enables automated trading by connecting TradingView alerts to broker APIs.

## Technology Stack
- **Framework**: Next.js with TypeScript
- **UI Library**: Chakra UI v3.17.0
- **State Management**: React Context API, custom hooks
- **API Integration**: Repository pattern with Supabase and REST implementations
- **Authentication**: Supabase JWT with HTTP-only cookies

## Project Structure
\`\`\`
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
\`\`\`

## Setup Instructions
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Run the development server: \`npm run dev\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Guidelines
- Follow TypeScript strict mode practices
- Use the repository pattern for all data access
- Create reusable components in the components/common directory
- Implement proper error handling
- Ensure accessibility compliance
- Write unit tests for components and hooks

## Available Scripts
- \`npm run dev\`: Start development server
- \`npm run build\`: Build for production
- \`npm start\`: Start production server
- \`npm run lint\`: Run ESLint
`;

fs.writeFileSync(path.join(frontendDir, 'README.md'), readmeContent);
console.log('README.md created successfully!');

// Step 5: Configure Chakra UI Provider
console.log('\n5. Setting up Chakra UI provider...');

// Create theme file
const themeContent = `import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const colors = {
  brand: {
    50: '#e6f1fe',
    100: '#cce3fd',
    200: '#99c7fb',
    300: '#66aaf9',
    400: '#338ef7',
    500: '#0072f5', // primary
    600: '#005bc4',
    700: '#004493',
    800: '#002e62',
    900: '#001731',
  },
};

const fonts = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  components: {
    // Add component overrides here
  },
});

export default theme;
`;

fs.writeFileSync(path.join(frontendDir, 'styles', 'theme.ts'), themeContent);
console.log('Theme file created successfully!');

// Create ChakraProvider wrapper
const providerContent = `'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@/styles/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}
`;

fs.writeFileSync(path.join(frontendDir, 'app', 'providers.tsx'), providerContent);
console.log('Chakra providers file created successfully!');

// Update layout.tsx to use the Providers component
const layoutPath = path.join(frontendDir, 'app', 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf-8');

layoutContent = layoutContent.replace(
  'export default function RootLayout({',
  `import { Providers } from './providers'

export default function RootLayout({`
);

layoutContent = layoutContent.replace(
  '<body className={inter.className}>{children}</body>',
  '<body className={inter.className}><Providers>{children}</Providers></body>'
);

fs.writeFileSync(layoutPath, layoutContent);
console.log('Updated layout.tsx to use Chakra UI providers');

// Step 6: Ensure TypeScript strict mode
console.log('\n6. Ensuring TypeScript strict mode...');
const tsconfigPath = path.join(frontendDir, 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

// Ensure strict mode is enabled
if (!tsconfig.compilerOptions) {
  tsconfig.compilerOptions = {};
}

tsconfig.compilerOptions.strict = true;
tsconfig.compilerOptions.noImplicitAny = true;
tsconfig.compilerOptions.strictNullChecks = true;
tsconfig.compilerOptions.strictFunctionTypes = true;
tsconfig.compilerOptions.strictBindCallApply = true;
tsconfig.compilerOptions.strictPropertyInitialization = true;
tsconfig.compilerOptions.noImplicitThis = true;
tsconfig.compilerOptions.alwaysStrict = true;

fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
console.log('TypeScript strict mode enabled in tsconfig.json');

console.log('\nSetup completed successfully! The Next.js frontend project with TypeScript and Chakra UI is ready.');