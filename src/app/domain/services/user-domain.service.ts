import { Injectable } from '@angular/core';
import { User, UserStatus } from '../entities/user.entity';
import { SharedUtilitiesService } from './shared-utilities.service';

/**
 * Optimized User Domain Service - Pure Business Logic Only
 * Focuses on business rules, validations, and entity operations
 * Eliminates duplicate logic with Application Service
 */
@Injectable({
  providedIn: 'root'
})
export class UserDomainService {

  constructor(private sharedUtilities: SharedUtilitiesService) { }

  /**
   * Business rule: Check if user can be activated
   */
  canActivateUser(user: User): boolean {
    return user.status === 'inactive' || user.status === 'suspended';
  }

  /**
   * Business rule: Check if user can be deactivated
   */
  canDeactivateUser(user: User): boolean {
    return user.status === 'active';
  }

  /**
   * Business rule: Check if user can be suspended
   */
  canSuspendUser(user: User): boolean {
    return user.status === 'active';
  }

  /**
   * Business rule: Validate user creation parameters
   * Consolidated validation logic
   */
  validateUserCreation(email: string, displayName: string): void {
    this.sharedUtilities.validateRequired(email, 'Email');
    this.sharedUtilities.validateRequired(displayName, 'Display name');

    if (!this.sharedUtilities.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    this.sharedUtilities.validateStringLength(displayName.trim(), 2, 50, 'Display name');
  }

  /**
   * Business rule: Validate user status transition
   */
  validateStatusTransition(currentStatus: UserStatus, newStatus: UserStatus): void {
    const validTransitions: Record<UserStatus, UserStatus[]> = {
      'active': ['inactive', 'suspended'],
      'inactive': ['active'],
      'suspended': ['active', 'inactive']
    };

    this.sharedUtilities.validateStatusTransition(currentStatus, newStatus, validTransitions);
  }

  /**
   * Business operation: Create a new user with full validation
   * Consolidated creation logic
   */
  createUser(email: string, displayName: string, photoURL?: string): User {
    // Validate creation parameters
    this.validateUserCreation(email, displayName);

    // Create user using entity factory method (ID is generated internally)
    return User.create({
      email: email.toLowerCase().trim(),
      displayName: displayName.trim(),
      photoURL
    });
  }

  /**
   * Business operation: Update user profile with validation
   */
  updateUserProfile(user: User, displayName: string, photoURL?: string): void {
    // Validate display name
    this.sharedUtilities.validateStringLength(displayName.trim(), 2, 50, 'Display name');

    // Update using entity method
    user.updateProfile(displayName.trim(), photoURL);
  }

  /**
   * Business operation: Update user status with validation
   */
  updateUserStatus(user: User, newStatus: UserStatus): void {
    // Validate status transition
    this.validateStatusTransition(user.status, newStatus);

    // Update using entity method
    user.updateStatus(newStatus);
  }

  /**
   * Business rule: Check if user email can be updated
   */
  canUpdateEmail(user: User, newEmail: string): boolean {
    if (!this.sharedUtilities.isValidEmail(newEmail)) {
      return false;
    }
    return user.email !== newEmail.toLowerCase().trim();
  }

  /**
   * Business operation: Update user email with validation
   */
  updateUserEmail(user: User, newEmail: string): void {
    if (!this.canUpdateEmail(user, newEmail)) {
      throw new Error('Cannot update email: invalid email or same as current');
    }

    user.updateEmail(newEmail.toLowerCase().trim());
  }
} 