'use client'

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Link as ChakraLink,
  CloseButton,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { FiHome, FiZap, FiCpu, FiArchive, FiBarChart2 } from 'react-icons/fi';

// Navigation data
const LinkItems = [
  { name: 'Dashboard', icon: FiHome, path: '/' },
  { name: 'Webhook Setup', icon: FiZap, path: '/webhook-setup' },
  { name: 'Brokers', icon: FiCpu, path: '/brokers' },
  { name: 'Bots', icon: FiArchive, path: '/bots' },
  { name: 'Logs', icon: FiArchive, path: '/logs' },
  { name: 'Analytics', icon: FiBarChart2, path: '/analytics' },
];

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();

  return (
    <Box minH="100vh">
      {/* Desktop sidebar */}
      <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        h="full"
        w={{ base: 0, md: 60 }}
        bg={useColorModeValue('white', 'gray.800')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        display={{ base: 'none', md: 'block' }}
      >
        <SidebarContent />
      </Box>
      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* Mobile nav */}
      <MobileNav onOpen={onOpen} />
      {/* Main content */}
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  )
}

// Sidebar content
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <VStack align="start" p="4" spacing="4">
      <Text fontSize="2xl" fontWeight="bold">Viewzenix</Text>
      {LinkItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <ChakraLink
            as={NextLink}
            href={item.path}
            key={item.name}
            display="flex"
            alignItems="center"
            p="2"
            borderRadius="md"
            bg={isActive ? useColorModeValue('gray.200', 'gray.700') : 'transparent'}
            _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
            w="full"
            onClick={onClose}
          >
            <Box as={item.icon} mr="3" fontSize="lg" />
            <Text>{item.name}</Text>
          </ChakraLink>
        )
      })}
    </VStack>
  );
}

// Mobile navigation bar
function MobileNav({ onOpen }: { onOpen: () => void }) {
  return (
    <Flex
      as="header"
      pos="fixed"
      top="0"
      left="0"
      w="full"
      align="center"
      bg={useColorModeValue('white', 'gray.800')}
      borderBottom="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justify="space-between"
      px="4"
      h="14"
      display={{ base: 'flex', md: 'none' }}
    >
      <IconButton
        aria-label="Open menu"
        icon={<FiMenu />}
        onClick={onOpen}
        variant="ghost"
      />
      <Text fontSize="lg" fontWeight="bold">Viewzenix</Text>
      <CloseButton display={{ base: 'none', md: 'block' }} onClick={onOpen} />
    </Flex>
  );
}