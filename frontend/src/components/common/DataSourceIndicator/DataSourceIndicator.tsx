import React, { useState, useEffect } from 'react';
import { Box, Text, Tooltip, HStack, Badge, Icon } from '@chakra-ui/react';
import { WebhookDataSource } from '@/hooks/useWebhooks';

// Import icons as needed
// For example, if using react-icons:
// import { FaCloud, FaDatabase, FaHdd, FaQuestion, FaWifi, FaWifiSlash } from 'react-icons/fa';

interface DataSourceIndicatorProps {
  dataSource: WebhookDataSource;
  lastUpdated?: Date | string | null;
}

/**
 * Component that indicates the current data source and connection status
 */
export function DataSourceIndicator({ dataSource, lastUpdated }: DataSourceIndicatorProps) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');
  
  // Update online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Format last updated time
  useEffect(() => {
    if (!lastUpdated) {
      setLastUpdatedTime('');
      return;
    }
    
    const date = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      setLastUpdatedTime('just now');
    } else if (diffMins < 60) {
      setLastUpdatedTime(`${diffMins} minute${diffMins === 1 ? '' : 's'} ago`);
    } else {
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        setLastUpdatedTime(`${diffHours} hour${diffHours === 1 ? '' : 's'} ago`);
      } else {
        const diffDays = Math.floor(diffHours / 24);
        setLastUpdatedTime(`${diffDays} day${diffDays === 1 ? '' : 's'} ago`);
      }
    }
  }, [lastUpdated]);
  
  // Get data source info
  const getDataSourceInfo = () => {
    switch (dataSource) {
      case 'supabase':
        return {
          label: 'Supabase',
          color: 'green',
          tooltip: 'Connected to Supabase database with real-time updates',
          // icon: <Icon as={FaDatabase} />,
        };
      case 'api':
        return {
          label: 'API',
          color: 'blue',
          tooltip: 'Connected to REST API with periodic updates',
          // icon: <Icon as={FaCloud} />,
        };
      case 'localStorage':
        return {
          label: 'Local',
          color: isOnline ? 'orange' : 'red',
          tooltip: isOnline 
            ? 'Using local storage (API/Supabase unavailable)' 
            : 'Offline mode - using cached data',
          // icon: <Icon as={FaHdd} />,
        };
      default:
        return {
          label: 'Unknown',
          color: 'gray',
          tooltip: 'Unknown data source',
          // icon: <Icon as={FaQuestion} />,
        };
    }
  };
  
  const { label, color, tooltip } = getDataSourceInfo();
  
  return (
    <Tooltip label={tooltip} placement="top">
      <HStack spacing={1} opacity={0.8} fontSize="xs">
        {/* Connection status */}
        <Box 
          w="8px" 
          h="8px" 
          borderRadius="full" 
          bg={isOnline ? 'green.500' : 'red.500'} 
          mr={1}
        />
        
        {/* Data source */}
        <Badge colorScheme={color} variant="subtle" px={2} py={0.5}>
          {label}
        </Badge>
        
        {/* Last updated time */}
        {lastUpdatedTime && (
          <Text fontSize="xs" color="gray.500">
            Updated {lastUpdatedTime}
          </Text>
        )}
      </HStack>
    </Tooltip>
  );
}