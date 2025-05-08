'use client'

import React, { forwardRef } from 'react'
import styles from './FormInput.module.css'

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={styles.formField}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${error ? styles.inputError : ''} ${className || ''}`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : 
            undefined
          }
          {...props}
        />
        
        {error && (
          <div id={`${inputId}-error`} className={styles.error}>
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={`${inputId}-helper`} className={styles.helperText}>
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'