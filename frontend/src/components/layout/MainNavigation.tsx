'use client';

import { Box, Stack, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  label: string;
  icon?: string;
}

export function MainNavigation() {
  return (
    <Stack spacing={4}>
      <Box py={4}>
        <Text fontSize="xl" fontWeight="bold">Viewzenix</Text>
      </Box>
      
      <NavItem href="/dashboard" label="Dashboard" />
      <NavItem href="/webhook-setup" label="Webhook Setup" />
      <NavItem href="/brokers" label="Broker Connections" />
      <NavItem href="/bots" label="Trading Bots" />
      <NavItem href="/logs" label="Activity Logs" />
      <NavItem href="/analytics" label="Analytics" />
      <NavItem href="/settings" label="Settings" />
    </Stack>
  );
}

function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      as={NextLink}
      href={href}
      display="flex"
      alignItems="center"
      px={4}
      py={2}
      rounded="md"
      fontWeight={isActive ? "semibold" : "normal"}
      bg={isActive ? "gray.100" : "transparent"}
      _dark={{
        bg: isActive ? "gray.700" : "transparent",
      }}
      _hover={{
        bg: "gray.100",
        _dark: {
          bg: "gray.700",
        },
      }}
    >
      {icon && <Box mr={3}>{icon}</Box>}
      <Text>{label}</Text>
    </Link>
  );
}