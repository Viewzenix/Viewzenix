'use client';

import { IconButton, useColorMode, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

/**
 * Toggle button for switching between light and dark mode
 */
export const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <Tooltip label={colorMode === 'dark' ? 'Light mode' : 'Dark mode'} placement="right">
      <IconButton
        aria-label={`Toggle ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        colorScheme={useColorModeValue('gray', 'blue')}
        size="md"
      />
    </Tooltip>
  );
};