'use client';

import { Box, useBreakpointValue, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component with responsive sidebar
 * This layout should wrap all protected pages
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const mainBg = useColorModeValue('gray.50', 'gray.800');

  // Initialize collapsed state based on saved preference or screen size
  useEffect(() => {
    // Try to get saved preference from localStorage
    const savedCollapsedState = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(savedCollapsedState === 'true');
    } else {
      // Default based on screen size if no preference saved
      setIsCollapsed(window.innerWidth < 1280);
    }
  }, []);

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box h="100vh" overflow="hidden" position="relative">
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      
      <Box
        ml={isMobile ? 0 : isCollapsed ? "70px" : "260px"}
        transition="margin-left 0.2s ease"
        bg={mainBg}
        minH="100vh"
        p={5}
        overflowY="auto"
      >
        {/* Main content area */}
        <Box pt={isMobile ? 16 : 2} pb={5}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};