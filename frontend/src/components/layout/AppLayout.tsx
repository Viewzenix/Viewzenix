'use client';

import { useState } from 'react';
import { 
  Box, 
  Flex, 
  IconButton, 
  Drawer, 
  useBreakpointValue,
  CloseButton
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { MainNavigation } from './MainNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  
  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Flex h="100vh">
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box
          w="250px"
          h="full"
          bg="white"
          _dark={{ bg: 'gray.800' }}
          boxShadow="sm"
          p={4}
        >
          <MainNavigation />
        </Box>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <>
          <IconButton
            aria-label="Open menu"
            icon="menu"
            position="fixed"
            top={4}
            left={4}
            zIndex={20}
            onClick={() => setOpen(true)}
          />
          
          <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Backdrop />
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Menu</Drawer.Title>
                <CloseButton onClick={() => setOpen(false)} />
              </Drawer.Header>
              <Drawer.Body>
                <MainNavigation />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        </>
      )}

      {/* Main content */}
      <Box flex="1" overflow="auto">
        {children}
      </Box>
    </Flex>
  );
}