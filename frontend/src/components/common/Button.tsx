'use client'

import React, { forwardRef } from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon,
    fullWidth = false,
    className = '',
    disabled,
    ...props 
  }, ref) => {
    // Combine appropriate classes
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className={styles.loadingSpinner} aria-hidden="true">
            <span className={styles.spinner}></span>
          </span>
        )}
        
        {icon && !loading && (
          <span className={styles.icon}>{icon}</span>
        )}
        
        <span className={loading ? styles.loadingText : ''}>
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'