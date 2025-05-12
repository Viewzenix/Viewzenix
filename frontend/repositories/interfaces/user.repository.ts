import { BaseRepository } from './base.repository';
import { AuthMethods, UpdateUserProfileDto, User, UserPreferences } from '@/types/user.types';
import { RepositoryResult, RepositoryVoidResult } from '@/types';

/**
 * Repository interface for user data
 */
export interface UserRepository extends BaseRepository<User, string, never, UpdateUserProfileDto> {
  /**
   * Get the current authenticated user
   * 
   * @returns Promise with the current user
   */
  getCurrentUser(): Promise<RepositoryResult<User>>;
  
  /**
   * Update the current user's profile
   * 
   * @param data - Updated profile data
   * @returns Promise with the updated user
   */
  updateProfile(data: UpdateUserProfileDto): Promise<RepositoryResult<User>>;
  
  /**
   * Get the current user's preferences
   * 
   * @returns Promise with user preferences
   */
  getUserPreferences(): Promise<RepositoryResult<UserPreferences>>;
  
  /**
   * Update the current user's preferences
   * 
   * @param preferences - Updated preferences
   * @returns Promise with the updated preferences
   */
  updateUserPreferences(preferences: Partial<UserPreferences>): Promise<RepositoryResult<UserPreferences>>;
  
  /**
   * Change the user's password
   * 
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise with void result
   */
  changePassword(currentPassword: string, newPassword: string): Promise<RepositoryVoidResult>;
  
  /**
   * Request a password reset
   * 
   * @param email - User's email
   * @returns Promise with void result
   */
  requestPasswordReset(email: string): Promise<RepositoryVoidResult>;
  
  /**
   * Get the current user's authentication methods
   * 
   * @returns Promise with auth methods
   */
  getAuthMethods(): Promise<RepositoryResult<AuthMethods>>;
  
  /**
   * Enable or disable two-factor authentication
   * 
   * @param enable - Whether to enable or disable
   * @returns Promise with the setup data if enabling, or void if disabling
   */
  configureTwoFactor(enable: boolean): Promise<RepositoryResult<{ qrCode?: string; secret?: string; }>>;
  
  /**
   * Verify a two-factor authentication code
   * 
   * @param code - Verification code
   * @returns Promise with void result
   */
  verifyTwoFactorCode(code: string): Promise<RepositoryVoidResult>;
}