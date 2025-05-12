import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
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