'use client';

import { 
  Box,
  Badge,
  Heading,
  Text,
  Flex,
  IconButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Tooltip,
  HStack,
  Switch,
  useClipboard,
} from '@chakra-ui/react';
import { 
  DeleteIcon, 
  EditIcon, 
  ChevronDownIcon, 
  CopyIcon, 
  ExternalLinkIcon,
  InfoIcon
} from '@chakra-ui/icons';
import Link from 'next/link';
import { format } from 'date-fns';
import { WebhookConfig } from '@/types';

interface WebhookCardProps {
  webhook: WebhookConfig;
  onDeleteClick: () => void;
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
}

export const WebhookCard: React.FC<WebhookCardProps> = ({
  webhook,
  onDeleteClick,
  onToggleStatus
}) => {
  const { 
    id, 
    name, 
    webhookUrl, 
    securityToken, 
    isActive, 
    description, 
    createdAt 
  } = webhook;

  const { hasCopied: hasUrlCopied, onCopy: onUrlCopy } = useClipboard(webhookUrl);
  const { hasCopied: hasTokenCopied, onCopy: onTokenCopy } = useClipboard(securityToken);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');
  
  const handleToggleStatus = async () => {
    await onToggleStatus(id, isActive);
  };

  const formattedDate = format(new Date(createdAt), 'MMM d, yyyy');

  return (
    <Box 
      p={5} 
      borderWidth="1px" 
      borderRadius="lg" 
      borderColor={borderColor}
      bg={cardBg}
      shadow="sm"
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
      position="relative"
      data-testid="webhook-card"
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Badge 
          colorScheme={isActive ? 'green' : 'gray'}
          variant="subtle"
          px={2}
          py={1}
          borderRadius="full"
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
        
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<ChevronDownIcon />}
            variant="ghost"
            size="sm"
          />
          <MenuList>
            <MenuItem 
              as={Link}
              href={`/webhooks/${id}`}
              icon={<InfoIcon />}
            >
              View Details
            </MenuItem>
            <MenuItem 
              as={Link}
              href={`/webhooks/${id}/edit`}
              icon={<EditIcon />}
            >
              Edit
            </MenuItem>
            <MenuItem 
              icon={<DeleteIcon />}
              onClick={onDeleteClick}
              color="red.500"
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      
      <Heading 
        as="h3" 
        size="md" 
        mb={2}
        noOfLines={1}
        title={name}
      >
        {name}
      </Heading>
      
      {description && (
        <Text 
          color={descriptionColor} 
          fontSize="sm" 
          mb={4}
          noOfLines={2}
          title={description}
        >
          {description}
        </Text>
      )}
      
      <Box mb={4}>
        <Text fontSize="xs" fontWeight="bold" mb={1}>WEBHOOK URL</Text>
        <Flex mb={2}>
          <Text 
            flex="1" 
            fontSize="sm" 
            noOfLines={1} 
            fontFamily="mono"
            bg={useColorModeValue('gray.100', 'gray.700')}
            p={1}
            borderRadius="md"
          >
            {webhookUrl}
          </Text>
          <Tooltip label={hasUrlCopied ? "Copied!" : "Copy URL"}>
            <IconButton
              aria-label="Copy webhook URL"
              icon={<CopyIcon />}
              size="xs"
              ml={2}
              onClick={onUrlCopy}
            />
          </Tooltip>
        </Flex>
        
        <Text fontSize="xs" fontWeight="bold" mb={1}>SECURITY TOKEN</Text>
        <Flex>
          <Text 
            flex="1" 
            fontSize="sm" 
            noOfLines={1} 
            fontFamily="mono"
            bg={useColorModeValue('gray.100', 'gray.700')}
            p={1}
            borderRadius="md"
          >
            {securityToken.substring(0, 8)}...
          </Text>
          <Tooltip label={hasTokenCopied ? "Copied!" : "Copy Token"}>
            <IconButton
              aria-label="Copy security token"
              icon={<CopyIcon />}
              size="xs"
              ml={2}
              onClick={onTokenCopy}
            />
          </Tooltip>
        </Flex>
      </Box>
      
      <Flex justify="space-between" align="center" fontSize="sm">
        <Text color={descriptionColor}>
          Created: {formattedDate}
        </Text>
        
        <HStack>
          <Text>Active</Text>
          <Switch 
            isChecked={isActive} 
            onChange={handleToggleStatus}
            colorScheme="green"
            size="sm"
          />
        </HStack>
      </Flex>
    </Box>
  );
};