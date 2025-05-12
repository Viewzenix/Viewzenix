/**
 * User type definitions
 */

/**
 * User entity
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;
  
  /**
   * User's email
   */
  email: string;
  
  /**
   * User's username or display name
   */
  username?: string;
  
  /**
   * User's full name
   */
  fullName?: string;
  
  /**
   * Avatar URL
   */
  avatarUrl?: string;
  
  /**
   * User role
   */
  role: UserRole;
  
  /**
   * User permissions
   */
  permissions: string[];
  
  /**
   * Creation timestamp
   */
  createdAt: string;
  
  /**
   * Last update timestamp
   */
  updatedAt: string;
}

/**
 * User roles
 */
export enum UserRole {
  ADMIN = 'admin',
  TRADER = 'trader',
  VIEWER = 'viewer',
}

/**
 * User profile update data
 */
export interface UpdateUserProfileDto {
  /**
   * User's username or display name
   */
  username?: string;
  
  /**
   * User's full name
   */
  fullName?: string;
  
  /**
   * Avatar URL
   */
  avatarUrl?: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  /**
   * Theme preference
   */
  theme: 'light' | 'dark' | 'system';
  
  /**
   * Default dashboard view
   */
  defaultView: 'activity' | 'webhooks' | 'analytics';
  
  /**
   * Notification settings
   */
  notifications: {
    email: boolean;
    browser: boolean;
    tradeSuccess: boolean;
    tradeFailure: boolean;
  };
}

/**
 * User authentication methods
 */
export interface AuthMethods {
  email: boolean;
  google: boolean;
  github: boolean;
  passwordEnabled: boolean;
  totpEnabled: boolean;
}