import { Injectable } from '@angular/core';
import { User, UserStatus } from '../entities/user.entity';

/**
 * User domain service containing business logic and validation rules
 * 簡化：直接使用實體的工廠方法和驗證邏輯
 */
@Injectable({
  providedIn: 'root'
})
export class UserDomainService {

  /**
   * Generate a unique user ID
   */
  generateUserId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `user_${timestamp}_${random}`;
  }

  /**
   * Check if user can be activated
   */
  canActivateUser(user: User): boolean {
    return user.status.getValue() === 'Inactive' || user.status.getValue() === 'Pending';
  }

  /**
   * Check if user can be deactivated
   */
  canDeactivateUser(user: User): boolean {
    return user.status.getValue() === 'Active';
  }

  /**
   * Check if user can be suspended
   */
  canSuspendUser(user: User): boolean {
    return user.status.getValue() === 'Active';
  }

  /**
   * Validate user status transition
   */
  validateStatusTransition(currentStatus: UserStatus, newStatus: UserStatus): void {
    const validTransitions: Record<string, string[]> = {
      'Pending': ['Active', 'Inactive'],
      'Active': ['Inactive', 'Suspended'],
      'Inactive': ['Active'],
      'Suspended': ['Active', 'Inactive']
    };

    const currentStatusValue = currentStatus.getValue();
    const newStatusValue = newStatus.getValue();
    const allowedTransitions = validTransitions[currentStatusValue] || [];
    
    if (!allowedTransitions.includes(newStatusValue)) {
      throw new Error(`Invalid status transition from ${currentStatusValue} to ${newStatusValue}`);
    }
  }

  /**
   * Create a new user with validation
   * 簡化：直接使用實體的工廠方法
   */
  createUser(email: string, displayName: string, photoURL?: string): User {
    return User.create(
      this.generateUserId(),
      email,
      displayName,
      photoURL
    );
  }

  /**
   * Update user profile with validation
   * 簡化：使用實體的內建驗證
   */
  updateUserProfile(user: User, displayName: string, photoURL?: string): void {
    user.updateProfile(displayName.trim(), photoURL);
  }

  /**
   * Update user status with validation
   */
  updateUserStatus(user: User, newStatus: UserStatus): void {
    this.validateStatusTransition(user.status, newStatus);
    user.updateStatus(newStatus);
  }
} 