'use client';

import { 
  Box, 
  Flex, 
  VStack, 
  IconButton, 
  useColorModeValue, 
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
  Spacer
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { 
  HamburgerIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  DashboardIcon, 
  SettingsIcon, 
  InfoIcon,
  BellIcon,
  ChatIcon
} from '@chakra-ui/icons';
import { Logo } from './Logo';
import { NavigationItem } from './NavigationItem';
import { ColorModeToggle } from './ColorModeToggle';

// Navigation items config
const NAV_ITEMS = [
  {
    title: 'Dashboard',
    path: '/',
    icon: DashboardIcon,
  },
  {
    title: 'Webhooks',
    path: '/webhooks',
    icon: ChatIcon,
  },
  {
    title: 'Notifications',
    path: '/notifications',
    icon: BellIcon,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
  },
  {
    title: 'About',
    path: '/about',
    icon: InfoIcon,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Sidebar component with navigation items and collapse functionality
 */
export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Close drawer when switching to desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      onClose();
    }
  }, [isMobile, isOpen, onClose]);

  const sidebarContent = (
    <VStack spacing={0} align="stretch" h="full">
      <Logo isCollapsed={isCollapsed} />
      
      <Box px={3} py={5}>
        <VStack align="stretch" spacing={1}>
          {NAV_ITEMS.map((item) => (
            <NavigationItem
              key={item.path}
              title={item.title}
              path={item.path}
              icon={item.icon}
              isCollapsed={isCollapsed}
            />
          ))}
        </VStack>
      </Box>

      <Spacer />
      
      <Box p={4} borderTop="1px" borderTopColor={borderColor}>
        <Flex justify={isCollapsed ? "center" : "space-between"} align="center">
          <ColorModeToggle />
          
          {!isCollapsed && (
            <IconButton
              aria-label="Collapse sidebar"
              icon={<ChevronLeftIcon />}
              onClick={onToggleCollapse}
              size="sm"
              variant="ghost"
            />
          )}
        </Flex>
      </Box>
    </VStack>
  );

  // Mobile drawer sidebar
  if (isMobile) {
    return (
      <>
        <IconButton
          aria-label="Open navigation"
          icon={<HamburgerIcon />}
          onClick={onOpen}
          position="absolute"
          top={4}
          left={4}
          zIndex={20}
          size="md"
          variant="ghost"
        />
        
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent maxW="260px">
            {sidebarContent}
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop sidebar
  return (
    <Box
      position="fixed"
      h="100vh"
      w={isCollapsed ? "70px" : "260px"}
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      transition="width 0.2s ease"
    >
      {sidebarContent}
      
      {isCollapsed && (
        <IconButton
          aria-label="Expand sidebar"
          icon={<ChevronRightIcon />}
          onClick={onToggleCollapse}
          position="absolute"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          size="sm"
          variant="ghost"
        />
      )}
    </Box>
  );
};