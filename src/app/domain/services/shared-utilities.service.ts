import { Injectable } from '@angular/core';

/**
 * Shared utilities service for common operations across domain services
 * Eliminates duplicate utility methods
 */
@Injectable({
    providedIn: 'root'
})
export class SharedUtilitiesService {

    /**
     * Generate a unique ID with prefix
     * @param prefix ID prefix (e.g., 'user', 'account', 'transaction')
     * @returns Generated unique ID
     */
    generateId(prefix: string): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 11);
        return `${prefix}_${timestamp}_${random}`;
    }

    /**
     * Generate a unique transaction number
     * @returns Generated transaction number
     */
    generateTransactionNumber(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `TXN${timestamp}${random}`;
    }

    /**
     * Generate a unique account number
     * @returns Generated account number
     */
    generateAccountNumber(): string {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${timestamp.slice(-6)}${random}`;
    }

    /**
     * Validate email format
     * @param email Email to validate
     * @returns True if email is valid
     */
    isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Validate string length
     * @param value String to validate
     * @param minLength Minimum length
     * @param maxLength Maximum length
     * @param fieldName Field name for error messages
     * @throws Error if validation fails
     */
    validateStringLength(value: string, minLength: number, maxLength: number, fieldName: string): void {
        if (!value || value.trim().length === 0) {
            throw new Error(`${fieldName} is required`);
        }
        if (value.length < minLength) {
            throw new Error(`${fieldName} must be at least ${minLength} characters`);
        }
        if (value.length > maxLength) {
            throw new Error(`${fieldName} cannot exceed ${maxLength} characters`);
        }
    }

    /**
     * Validate positive number
     * @param value Number to validate
     * @param fieldName Field name for error messages
     * @throws Error if validation fails
     */
    validatePositiveNumber(value: number, fieldName: string): void {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`${fieldName} must be a valid number`);
        }
        if (value <= 0) {
            throw new Error(`${fieldName} must be greater than 0`);
        }
    }

    /**
     * Validate non-negative number
     * @param value Number to validate
     * @param fieldName Field name for error messages
     * @throws Error if validation fails
     */
    validateNonNegativeNumber(value: number, fieldName: string): void {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`${fieldName} must be a valid number`);
        }
        if (value < 0) {
            throw new Error(`${fieldName} cannot be negative`);
        }
    }

    /**
     * Validate required field
     * @param value Value to validate
     * @param fieldName Field name for error messages
     * @throws Error if validation fails
     */
    validateRequired(value: any, fieldName: string): void {
        if (value === null || value === undefined || (typeof value === 'string' && value.trim().length === 0)) {
            throw new Error(`${fieldName} is required`);
        }
    }

    /**
     * Validate status transition
     * @param currentStatus Current status
     * @param newStatus New status
     * @param validTransitions Valid transitions map
     * @throws Error if transition is invalid
     */
    validateStatusTransition(
        currentStatus: string,
        newStatus: string,
        validTransitions: Record<string, string[]>
    ): void {
        const allowedTransitions = validTransitions[currentStatus] || [];
        if (!allowedTransitions.includes(newStatus)) {
            throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }
    }
}