'use client';

import { 
  Box, 
  Text, 
  useColorModeValue, 
  Flex 
} from '@chakra-ui/react';
import Link from 'next/link';

interface LogoProps {
  isCollapsed?: boolean;
}

/**
 * Logo component for the sidebar
 * 
 * @param isCollapsed - Whether the sidebar is collapsed, affecting the logo display
 */
export const Logo: React.FC<LogoProps> = ({ isCollapsed = false }) => {
  const logoColor = useColorModeValue('brand.500', 'brand.300');
  
  return (
    <Link href="/">
      <Flex 
        align="center"
        px={4}
        h="16"
      >
        <Box 
          bg={logoColor} 
          borderRadius="md" 
          color="white" 
          p={1} 
          fontSize={isCollapsed ? 'lg' : 'md'} 
          fontWeight="bold"
          w={isCollapsed ? '40px' : '32px'}
          h={isCollapsed ? '40px' : '32px'}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          V
        </Box>
        
        {!isCollapsed && (
          <Text 
            ml={2} 
            fontSize="lg" 
            fontWeight="bold" 
            color={useColorModeValue('gray.800', 'white')}
          >
            Viewzenix
          </Text>
        )}
      </Flex>
    </Link>
  );
};