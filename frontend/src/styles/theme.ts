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
      ...defaultConfig.theme.tokens,
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
      colors: {
        ...defaultConfig.theme.tokens.colors,
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
          950: { value: '#2b3f9e' },
        },
      },
    },
    semanticTokens: {
      ...defaultConfig.theme.semanticTokens,
      colors: {
        ...defaultConfig.theme.semanticTokens.colors,
        brand: {
          solid: { value: '{colors.brand.500}' },
          contrast: { value: '{colors.brand.100}' },
          fg: { value: '{colors.brand.700}' },
          muted: { value: '{colors.brand.100}' },
          subtle: { value: '{colors.brand.200}' },
          emphasized: { value: '{colors.brand.300}' },
          focusRing: { value: '{colors.brand.500}' },
        },
      },
    },
    recipes: {
      ...defaultConfig.theme.recipes,
      button: {
        ...defaultConfig.theme.recipes.button,
        variants: {
          ...defaultConfig.theme.recipes.button?.variants,
          primary: {
            backgroundColor: 'brand.500',
            color: 'white',
            _hover: {
              backgroundColor: 'brand.600',
            },
            _active: {
              backgroundColor: 'brand.700',
            },
          },
        },
      },
    },
  },
});

export default system;