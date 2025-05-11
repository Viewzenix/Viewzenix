'use client';

import { createToaster, Toast as ToastPrimitive } from '@chakra-ui/react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { type ReactNode } from 'react';

export const {
  Toaster: ToastProvider,
  toast: toaster,
} = createToaster({
  placement: 'top',
  render: ({ id, title, description, type, onClose }) => {
    let icon: ReactNode = null;
    let colorPalette: string = 'blue';
    
    switch (type) {
      case 'info':
        icon = <FaInfoCircle />;
        colorPalette = 'blue';
        break;
      case 'success':
        icon = <FaCheckCircle />;
        colorPalette = 'green';
        break;
      case 'warning':
        icon = <FaExclamationTriangle />;
        colorPalette = 'yellow';
        break;
      case 'error':
        icon = <FaTimesCircle />;
        colorPalette = 'red';
        break;
    }

    return (
      <ToastPrimitive.Root colorPalette={colorPalette} id={id}>
        <ToastPrimitive.Icon>{icon}</ToastPrimitive.Icon>
        <ToastPrimitive.Content>
          {title && <ToastPrimitive.Title>{title}</ToastPrimitive.Title>}
          {description && <ToastPrimitive.Description>{description}</ToastPrimitive.Description>}
        </ToastPrimitive.Content>
        <ToastPrimitive.CloseTrigger onClick={onClose} />
      </ToastPrimitive.Root>
    );
  },
});

export function Toaster() {
  return <ToastProvider />;
}