'use client';

import { Box, Flex, Text, Badge } from '@chakra-ui/react';

type DataSourceStatus = 'connected' | 'disconnected' | 'error' | 'pending';

interface DataSourceIndicatorProps {
  name: string;
  status: DataSourceStatus;
  lastUpdated?: string;
  message?: string;
}

export function DataSourceIndicator({
  name,
  status,
  lastUpdated,
  message
}: DataSourceIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'green';
      case 'disconnected':
        return 'gray';
      case 'error':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  return (
    <Box 
      p={3} 
      borderWidth="1px" 
      borderRadius="md" 
      borderColor={`${getStatusColor()}.200`}
      bg={`${getStatusColor()}.50`}
      _dark={{
        bg: `${getStatusColor()}.900`,
        borderColor: `${getStatusColor()}.800`,
      }}
    >
      <Flex justify="space-between" align="center">
        <Text fontWeight="medium">{name}</Text>
        <Badge colorPalette={getStatusColor()}>{getStatusText()}</Badge>
      </Flex>
      
      {message && (
        <Text fontSize="sm" mt={2} color="gray.600" _dark={{ color: 'gray.300' }}>
          {message}
        </Text>
      )}
      
      {lastUpdated && (
        <Text fontSize="xs" mt={1} color="gray.500">
          Last updated: {lastUpdated}
        </Text>
      )}
    </Box>
  );
}