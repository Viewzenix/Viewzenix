'use client';

import { 
  Box, 
  Flex, 
  Icon, 
  Text, 
  Tooltip, 
  useColorModeValue, 
  As
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItemProps {
  icon: As;
  title: string;
  path: string;
  isCollapsed: boolean;
}

/**
 * Navigation item component for the sidebar
 * 
 * @param icon - Icon component to display
 * @param title - Title of the navigation item
 * @param path - Path to navigate to
 * @param isCollapsed - Whether the sidebar is collapsed
 */
export const NavigationItem: React.FC<NavigationItemProps> = ({ 
  icon, 
  title, 
  path, 
  isCollapsed 
}) => {
  const pathname = usePathname();
  const isActive = path === '/' ? pathname === path : pathname.startsWith(path);
  
  const activeBg = useColorModeValue('brand.50', 'rgba(0, 114, 245, 0.2)');
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');
  const activeColor = useColorModeValue('brand.500', 'brand.300');
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');
  
  const content = (
    <Flex
      align="center"
      px={4}
      py={3}
      role="group"
      cursor="pointer"
      rounded="md"
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : textColor}
      _hover={{ bg: !isActive ? hoverBg : activeBg }}
      transition="all 0.2s"
      w="full"
    >
      <Icon 
        as={icon} 
        boxSize={5} 
        mr={isCollapsed ? 0 : 3} 
        color={isActive ? activeColor : 'inherit'}
        _groupHover={{ color: isActive ? activeColor : 'inherit' }}
      />
      {!isCollapsed && (
        <Text fontWeight={isActive ? 'semibold' : 'normal'}>
          {title}
        </Text>
      )}
    </Flex>
  );

  return (
    <Box mb={1} w="full">
      {isCollapsed ? (
        <Tooltip label={title} placement="right">
          <Link href={path}>
            {content}
          </Link>
        </Tooltip>
      ) : (
        <Link href={path}>
          {content}
        </Link>
      )}
    </Box>
  );
};