'use client'

import React, { forwardRef } from 'react'
import styles from './FormCheckbox.module.css'

export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={styles.formField}>
        <div className={styles.checkboxWrapper}>
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`${styles.checkbox} ${error ? styles.inputError : ''} ${className || ''}`}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${checkboxId}-error` : 
              helperText ? `${checkboxId}-helper` : 
              undefined
            }
            {...props}
          />
          
          <label htmlFor={checkboxId} className={styles.label}>
            {label}
          </label>
        </div>
        
        {error && (
          <div id={`${checkboxId}-error`} className={styles.error}>
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={`${checkboxId}-helper`} className={styles.helperText}>
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

FormCheckbox.displayName = 'FormCheckbox'