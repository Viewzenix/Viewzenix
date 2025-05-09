import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Drawer,
  IconButton,
  useDisclosure,
  Heading,
  Text,
  Stack,
  Link,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import { authService } from '@/services/auth.service';

// Mock navigation items
const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Webhooks', path: '/webhooks' },
  { name: 'Brokers', path: '/brokers' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Settings', path: '/settings' }
];

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { user: userData } = await authService.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    
    loadUser();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  const isActive = (path: string) => {
    return router.pathname === path;
  };
  
  return (
    <Box minH="100vh">
      {/* Header */}
      <Flex
        as="header"
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
        px={4}
        py={2}
        align="center"
        justify="space-between"
      >
        <Stack direction="row" gap={4}>
          <IconButton
            aria-label="Open menu"
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
          >
            <Text>≡</Text> {/* Replace with actual icon */}
          </IconButton>
          
          <Heading size="md" color="brand.500">Viewzenix</Heading>
        </Stack>
        
        {user && (
          <Menu>
            <MenuButton as={Button} variant="ghost">
              <Stack direction="row" gap={2} align="center">
                <Avatar size="sm" name={user.email} />
                <Text display={{ base: 'none', md: 'block' }}>{user.email}</Text>
                <Text>▼</Text>
              </Stack>
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Account Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
      
      {/* Sidebar for mobile */}
      <Drawer.Root open={isOpen} onOpenChange={(open) => open ? onOpen() : onClose()}>
        <Drawer.Backdrop />
        <Drawer.Content placement="left">
          <Drawer.CloseTrigger />
          <Drawer.Header>Navigation</Drawer.Header>
          
          <Drawer.Body>
            <Stack direction="column" align="stretch" gap={2}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? 'solid' : 'ghost'}
                  colorPalette={isActive(item.path) ? 'brand' : 'gray'}
                  justifyContent="flex-start"
                  onClick={() => {
                    router.push(item.path);
                    onClose();
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Stack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      
      {/* Main content area */}
      <Flex>
        {/* Desktop sidebar */}
        <Box
          as="nav"
          bg="white"
          borderRightWidth="1px"
          borderColor="gray.200"
          w="240px"
          minH="calc(100vh - 57px)"
          display={{ base: 'none', md: 'block' }}
          p={4}
        >
          <Stack direction="column" align="stretch" gap={2}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? 'solid' : 'ghost'}
                colorPalette={isActive(item.path) ? 'brand' : 'gray'}
                justifyContent="flex-start"
                onClick={() => router.push(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </Stack>
        </Box>
        
        {/* Page content */}
        <Box flex="1" overflowY="auto" bg="gray.50">
          {children}
        </Box>
      </Flex>
    </Box>
  );
}