'use client';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text
} from '@chakra-ui/react';
import { useRef } from 'react';

interface WebhookDeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  webhookName: string;
}

export const WebhookDeleteConfirmation: React.FC<WebhookDeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  webhookName
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Webhook Configuration
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text mb={4}>
              Are you sure you want to delete the webhook configuration 
              <Text as="span" fontWeight="bold"> "{webhookName}"</Text>?
            </Text>
            
            <Text fontSize="sm" color="red.500">
              This action cannot be undone. Any TradingView alerts using this webhook will stop working.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};