'use client';

import { useState } from 'react';
import { 
  Box,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { WebhookConfig } from '@/types';
import { WebhookCard } from '../WebhookCard/WebhookCard';
import { WebhookDeleteConfirmation } from '../WebhookDeleteConfirmation/WebhookDeleteConfirmation';

interface WebhookListProps {
  webhooks: WebhookConfig[];
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
}

export const WebhookList: React.FC<WebhookListProps> = ({ 
  webhooks, 
  onDelete,
  onToggleStatus
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null);

  const handleDeleteClick = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook);
    onOpen();
  };

  const handleConfirmDelete = async () => {
    if (selectedWebhook) {
      await onDelete(selectedWebhook.id);
      onClose();
    }
  };

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {webhooks.map(webhook => (
          <WebhookCard
            key={webhook.id}
            webhook={webhook}
            onDeleteClick={() => handleDeleteClick(webhook)}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </SimpleGrid>

      <WebhookDeleteConfirmation
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmDelete}
        webhookName={selectedWebhook?.name || ''}
      />
    </>
  );
};