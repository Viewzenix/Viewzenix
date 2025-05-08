'use client'

import React, { forwardRef } from 'react'
import styles from './FormInput.module.css'

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={styles.formField}>
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
        
        <textarea
          ref={ref}
          id={textareaId}
          className={`${styles.input} ${error ? styles.inputError : ''} ${className || ''}`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : 
            helperText ? `${textareaId}-helper` : 
            undefined
          }
          rows={4}
          {...props}
        />
        
        {error && (
          <div id={`${textareaId}-error`} className={styles.error}>
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={`${textareaId}-helper`} className={styles.helperText}>
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'