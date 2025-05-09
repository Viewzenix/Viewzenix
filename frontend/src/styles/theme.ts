import { createSystem, defaultConfig } from '@chakra-ui/react';

/**
 * Chakra UI v3 theme configuration
 * Using the new system-based approach with createSystem
 */
const system = createSystem({
  ...defaultConfig,
  theme: {
    ...defaultConfig.theme,
    tokens: {
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
      colors: {
        brand: {
          50: { value: '#f5f7ff' },
          100: { value: '#e0e7ff' },
          200: { value: '#bccafe' },
          300: { value: '#91a7ff' },
          400: { value: '#748ffc' },
          500: { value: '#5c7cfa' },
          600: { value: '#4c6ef5' },
          700: { value: '#4263eb' },
          800: { value: '#3b5bdb' },
          900: { value: '#364fc7' },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: '{colors.brand.500}' },
        'primary.focus': { value: '{colors.brand.600}' },
        'primary.hover': { value: '{colors.brand.600}' },
      },
    },
  },
});

export default system;