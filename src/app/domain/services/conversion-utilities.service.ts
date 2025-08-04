import { Injectable } from '@angular/core';

import { TransactionStatus, TransactionType } from '../entities/transaction.entity';
import { UserStatus } from '../entities/user.entity';
import { AccountStatus } from '../value-objects/account/account-status.value-object';
import { AccountType } from '../value-objects/account/account-type.value-object';

/**
 * Centralized conversion utilities service
 * Eliminates duplicate conversion logic across Application Services
 * Provides consistent conversion patterns and error handling
 */
@Injectable({
  providedIn: 'root'
})
export class ConversionUtilitiesService {
  /**
   * Convert string to UserStatus enum
   *
   * @param statusString Status string to convert
   * @returns UserStatus enum value
   * @throws Error if status string is invalid
   */
  stringToUserStatus(statusString: string): UserStatus {
    if (!statusString || typeof statusString !== 'string') {
      throw new Error('Status string is required');
    }

    const normalizedStatus = statusString.toLowerCase().trim();

    switch (normalizedStatus) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'inactive';
      case 'suspended':
        return 'suspended';
      default:
        throw new Error(`Invalid user status: ${statusString}. Valid values are: active, inactive, suspended`);
    }
  }

  /**
   * Convert string to AccountStatus value object
   *
   * @param statusString Status string to convert
   * @returns AccountStatus value object
   * @throws Error if status string is invalid
   */
  stringToAccountStatus(statusString: string): AccountStatus {
    if (!statusString || typeof statusString !== 'string') {
      throw new Error('Status string is required');
    }

    const normalizedStatus = statusString.toUpperCase().trim();

    switch (normalizedStatus) {
      case 'ACTIVE':
        return AccountStatus.ACTIVE();
      case 'INACTIVE':
        return AccountStatus.INACTIVE();
      case 'SUSPENDED':
        return AccountStatus.SUSPENDED();
      case 'CLOSED':
        return AccountStatus.CLOSED();
      default:
        throw new Error(`Invalid account status: ${statusString}. Valid values are: ACTIVE, INACTIVE, SUSPENDED, CLOSED`);
    }
  }

  /**
   * Convert string to AccountType value object
   *
   * @param typeString Type string to convert
   * @returns AccountType value object
   * @throws Error if type string is invalid
   */
  stringToAccountType(typeString: string): AccountType {
    if (!typeString || typeof typeString !== 'string') {
      throw new Error('Type string is required');
    }

    const normalizedType = typeString.toUpperCase().trim();

    switch (normalizedType) {
      case 'CHECKING':
        return AccountType.CHECKING();
      case 'SAVINGS':
        return AccountType.SAVINGS();
      case 'CREDIT':
        return AccountType.CREDIT();
      case 'INVESTMENT':
        return AccountType.INVESTMENT();
      default:
        throw new Error(`Invalid account type: ${typeString}. Valid values are: CHECKING, SAVINGS, CREDIT, INVESTMENT`);
    }
  }

  /**
   * Convert string to TransactionStatus enum
   *
   * @param statusString Status string to convert
   * @returns TransactionStatus enum value
   * @throws Error if status string is invalid
   */
  stringToTransactionStatus(statusString: string): TransactionStatus {
    if (!statusString || typeof statusString !== 'string') {
      throw new Error('Status string is required');
    }

    const normalizedStatus = statusString.toUpperCase().trim();

    // Check if the status exists in the TransactionStatus enum
    const validStatuses = Object.values(TransactionStatus);
    const matchingStatus = validStatuses.find(status => status === normalizedStatus);

    if (matchingStatus) {
      return matchingStatus;
    }

    throw new Error(`Invalid transaction status: ${statusString}. Valid values are: ${validStatuses.join(', ')}`);
  }

  /**
   * Convert string to TransactionType enum
   *
   * @param typeString Type string to convert
   * @returns TransactionType enum value
   * @throws Error if type string is invalid
   */
  stringToTransactionType(typeString: string): TransactionType {
    if (!typeString || typeof typeString !== 'string') {
      throw new Error('Type string is required');
    }

    const normalizedType = typeString.toUpperCase().trim();

    // Check if the type exists in the TransactionType enum
    const validTypes = Object.values(TransactionType);
    const matchingType = validTypes.find(type => type === normalizedType);

    if (matchingType) {
      return matchingType;
    }

    throw new Error(`Invalid transaction type: ${typeString}. Valid values are: ${validTypes.join(', ')}`);
  }

  /**
   * Convert UserStatus enum to display string
   *
   * @param status UserStatus enum value
   * @returns Formatted display string
   */
  userStatusToDisplayString(status: UserStatus): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'suspended':
        return 'Suspended';
      default:
        return 'Unknown';
    }
  }

  /**
   * Convert AccountStatus to display string
   *
   * @param status AccountStatus value object
   * @returns Formatted display string
   */
  accountStatusToDisplayString(status: AccountStatus): string {
    const statusValue = status.getValue();
    switch (statusValue) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'SUSPENDED':
        return 'Suspended';
      case 'CLOSED':
        return 'Closed';
      default:
        return 'Unknown';
    }
  }

  /**
   * Convert AccountType to display string
   *
   * @param type AccountType value object
   * @returns Formatted display string
   */
  accountTypeToDisplayString(type: AccountType): string {
    const typeValue = type.getValue();
    switch (typeValue) {
      case 'CHECKING':
        return 'Checking Account';
      case 'SAVINGS':
        return 'Savings Account';
      case 'CREDIT':
        return 'Credit Account';
      case 'INVESTMENT':
        return 'Investment Account';
      default:
        return 'Unknown Account Type';
    }
  }

  /**
   * Convert TransactionStatus to display string
   *
   * @param status TransactionStatus enum value
   * @returns Formatted display string
   */
  transactionStatusToDisplayString(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.PENDING:
        return 'Pending';
      case TransactionStatus.PROCESSING:
        return 'Processing';
      case TransactionStatus.COMPLETED:
        return 'Completed';
      case TransactionStatus.FAILED:
        return 'Failed';
      case TransactionStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  /**
   * Convert TransactionType to display string
   *
   * @param type TransactionType enum value
   * @returns Formatted display string
   */
  transactionTypeToDisplayString(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT:
        return 'Deposit';
      case TransactionType.WITHDRAWAL:
        return 'Withdrawal';
      case TransactionType.TRANSFER:
        return 'Transfer';
      case TransactionType.PAYMENT:
        return 'Payment';
      case TransactionType.REFUND:
        return 'Refund';
      case TransactionType.FEE:
        return 'Fee';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get all valid user status options for UI dropdowns
   *
   * @returns Array of status options with value and label
   */
  getUserStatusOptions(): Array<{ value: UserStatus; label: string }> {
    return [
      { value: 'active', label: this.userStatusToDisplayString('active') },
      { value: 'inactive', label: this.userStatusToDisplayString('inactive') },
      { value: 'suspended', label: this.userStatusToDisplayString('suspended') }
    ];
  }

  /**
   * Get all valid account status options for UI dropdowns
   *
   * @returns Array of status options with value and label
   */
  getAccountStatusOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'ACTIVE', label: this.accountStatusToDisplayString(AccountStatus.ACTIVE()) },
      { value: 'INACTIVE', label: this.accountStatusToDisplayString(AccountStatus.INACTIVE()) },
      { value: 'SUSPENDED', label: this.accountStatusToDisplayString(AccountStatus.SUSPENDED()) },
      { value: 'CLOSED', label: this.accountStatusToDisplayString(AccountStatus.CLOSED()) }
    ];
  }

  /**
   * Get all valid account type options for UI dropdowns
   *
   * @returns Array of type options with value and label
   */
  getAccountTypeOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'CHECKING', label: this.accountTypeToDisplayString(AccountType.CHECKING()) },
      { value: 'SAVINGS', label: this.accountTypeToDisplayString(AccountType.SAVINGS()) },
      { value: 'CREDIT', label: this.accountTypeToDisplayString(AccountType.CREDIT()) },
      { value: 'INVESTMENT', label: this.accountTypeToDisplayString(AccountType.INVESTMENT()) }
    ];
  }

  /**
   * Get all valid transaction status options for UI dropdowns
   *
   * @returns Array of status options with value and label
   */
  getTransactionStatusOptions(): Array<{ value: TransactionStatus; label: string }> {
    return Object.values(TransactionStatus).map(status => ({
      value: status,
      label: this.transactionStatusToDisplayString(status)
    }));
  }

  /**
   * Get all valid transaction type options for UI dropdowns
   *
   * @returns Array of type options with value and label
   */
  getTransactionTypeOptions(): Array<{ value: TransactionType; label: string }> {
    return Object.values(TransactionType).map(type => ({
      value: type,
      label: this.transactionTypeToDisplayString(type)
    }));
  }

  /**
   * Validate and convert multiple status strings at once
   *
   * @param statuses Array of status strings to convert
   * @param conversionType Type of conversion to perform
   * @returns Array of converted values
   * @throws Error if any conversion fails
   */
  batchConvertStatuses<T>(statuses: string[], conversionType: 'user' | 'account' | 'transaction'): T[] {
    if (!Array.isArray(statuses)) {
      throw new Error('Statuses must be an array');
    }

    return statuses.map(status => {
      switch (conversionType) {
        case 'user':
          return this.stringToUserStatus(status) as T;
        case 'account':
          return this.stringToAccountStatus(status) as T;
        case 'transaction':
          return this.stringToTransactionStatus(status) as T;
        default:
          throw new Error(`Invalid conversion type: ${conversionType}`);
      }
    });
  }
}
