'use client'

import React, { useEffect, useState } from 'react'
import styles from './StatusMessage.module.css'

export type StatusType = 'success' | 'error' | 'info' | 'warning'

export interface StatusMessageProps {
  type: StatusType;
  message: string;
  /** Auto-dismiss duration in milliseconds. Set to 0 to disable auto-dismiss. */
  duration?: number;
  /** Whether the message can be manually dismissed */
  dismissible?: boolean;
  /** Callback fired when the message is dismissed */
  onDismiss?: () => void;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  message,
  duration = 5000,
  dismissible = true,
  onDismiss
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Reset visibility when message changes
    setVisible(true);
    
    // Set up auto-dismiss timer if duration > 0
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };
  
  if (!visible) return null;

  return (
    <div className={`${styles.container} ${styles[type]}`} role="alert">
      <div className={styles.icon}>
        {type === 'success' && '✓'}
        {type === 'error' && '✗'}
        {type === 'info' && 'ℹ'}
        {type === 'warning' && '⚠'}
      </div>
      <div className={styles.message}>{message}</div>
      {dismissible && (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={handleDismiss}
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
};