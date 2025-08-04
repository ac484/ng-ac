import { Injectable } from '@angular/core';
import { Firestore, DocumentData, Query, where, query as firestoreQuery } from '@angular/fire/firestore';
import { BaseFirebaseRepository } from './base-firebase.repository';
import { OptimizedUser, UserData } from '../../domain/entities/optimized-user.entity';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';

/**
 * Optimized User Repository using the new BaseFirebaseRepository
 * Demonstrates the simplified repository pattern
 */
@Injectable({
    providedIn: 'root'
})
export class OptimizedUserRepository extends BaseFirebaseRepository<OptimizedUser> {

    constructor(firestore: Firestore) {
        super(firestore, 'users');
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<OptimizedUser | null> {
        try {
            this.logOperation('findByEmail', { email });

            const criteria: SearchCriteria = {
                filters: { email: email.toLowerCase() }
            };

            const users = await this.findAll(criteria);
            const user = users.length > 0 ? users[0] : null;

            this.logOperation('findByEmail', { email, found: !!user });
            return user;
        } catch (error) {
            this.logError('findByEmail', error, { email });
            throw error;
        }
    }

    /**
     * Check if user exists by email
     */
    async existsByEmail(email: string): Promise<boolean> {
        try {
            this.logOperation('existsByEmail', { email });

            const user = await this.findByEmail(email);
            const exists = user !== null;

            this.logOperation('existsByEmail', { email, exists });
            return exists;
        } catch (error) {
            this.logError('existsByEmail', error, { email });
            throw error;
        }
    }

    /**
     * Find users by status
     */
    async findByStatus(status: string): Promise<OptimizedUser[]> {
        try {
            this.logOperation('findByStatus', { status });

            const criteria: SearchCriteria = {
                status,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            };

            const users = await this.findAll(criteria);

            this.logOperation('findByStatus', { status, count: users.length });
            return users;
        } catch (error) {
            this.logError('findByStatus', error, { status });
            throw error;
        }
    }

    /**
     * Override search criteria application for user-specific needs
     */
    protected override applySearchCriteria(q: Query<DocumentData>, criteria: SearchCriteria): Query<DocumentData> {
        // Start with base criteria
        let query = super.applySearchCriteria(q, criteria);

        // Add user-specific search logic
        if (criteria.keyword) {
            // For keyword search, we might want to search in multiple fields
            // Note: Firestore doesn't support OR queries easily, so this is a simplified example
            // In a real implementation, you might need to use composite queries or full-text search
            query = firestoreQuery(q, where('displayName', '>=', criteria.keyword));
        }

        return query;
    }

    /**
     * Convert Firestore document to User entity
     */
    protected fromFirestore(data: DocumentData, id: string): OptimizedUser {
        const userData: UserData = {
            id,
            email: data['email'] || '',
            displayName: data['displayName'] || '',
            photoURL: data['photoURL'],
            isEmailVerified: data['isEmailVerified'] || false,
            isAnonymous: data['isAnonymous'] || false,
            authProvider: data['authProvider'] || 'email',
            status: data['status'] || 'active',
            lastLoginAt: data['lastLoginAt']?.toDate(),
            phoneNumber: data['phoneNumber'],
            roles: data['roles'] || [],
            permissions: data['permissions'] || [],
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date()
        };

        return new OptimizedUser(userData);
    }

    /**
     * Convert User entity to Firestore document
     */
    protected toFirestore(entity: OptimizedUser): DocumentData {
        return {
            email: entity.email,
            displayName: entity.displayName,
            photoURL: entity.photoURL,
            isEmailVerified: entity.isEmailVerified,
            isAnonymous: entity.isAnonymous,
            authProvider: entity.authProvider,
            status: entity.status,
            lastLoginAt: entity.lastLoginAt,
            phoneNumber: entity.phoneNumber,
            roles: entity.roles,
            permissions: entity.permissions,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}