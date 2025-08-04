import { Injectable } from '@angular/core';

import { BaseMockRepository } from './base-mock.repository';
import { User } from '../../domain/entities/user.entity';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';
import { UserRepository } from '../../domain/repositories/user.repository';

/**
 * Mock implementation of UserRepository using BaseMockRepository
 * Uses in-memory storage instead of Firebase with standardized operations
 */
@Injectable({
  providedIn: 'root'
})
export class MockUserRepository extends BaseMockRepository<User> implements UserRepository {
  constructor() {
    super();
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    await this.delay(100);
    this.logOperation('findByEmail', { email });

    for (const user of this.entities.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        this.logOperation('findByEmail', { email, found: true });
        return user;
      }
    }

    this.logOperation('findByEmail', { email, found: false });
    return null;
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    await this.delay(50);
    this.logOperation('existsByEmail', { email });

    for (const user of this.entities.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        this.logOperation('existsByEmail', { email, exists: true });
        return true;
      }
    }

    this.logOperation('existsByEmail', { email, exists: false });
    return false;
  }

  /**
   * Find all users with optional search criteria
   * Implements UserRepository interface
   */
  override async findAll(criteria?: SearchCriteria): Promise<User[]> {
    await this.delay(200);
    this.logOperation('findAll', { criteria });

    const searchCriteria: SearchCriteria = criteria || {
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    const users = await super.findAll(searchCriteria);
    this.logOperation('findAll', { criteria: searchCriteria, count: users.length });

    return users;
  }

  // save, delete, and count methods are inherited from BaseMockRepository

  /**
   * Find users by status
   */
  async findByStatus(status: string): Promise<User[]> {
    await this.delay(100);
    this.logOperation('findByStatus', { status });

    const criteria: SearchCriteria = {
      status,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    const users = await this.findAll(criteria);
    this.logOperation('findByStatus', { status, count: users.length });

    return users;
  }

  /**
   * Override keyword search for user-specific logic
   */
  protected override applyKeywordSearch(entities: User[], keyword: string): User[] {
    const lowerKeyword = keyword.toLowerCase();
    return entities.filter(
      user => user.displayName.toLowerCase().includes(lowerKeyword) || user.email.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Initialize mock data for testing
   */
  protected initializeMockData(): void {
    const mockUsers = [
      User.create({
        email: 'john.doe@example.com',
        displayName: 'John Doe',
        photoURL: 'https://example.com/avatar1.jpg'
      }),
      User.create({
        email: 'jane.smith@example.com',
        displayName: 'Jane Smith',
        photoURL: 'https://example.com/avatar2.jpg'
      }),
      User.create({
        email: 'bob.wilson@example.com',
        displayName: 'Bob Wilson'
      }),
      User.create({
        email: 'alice.brown@example.com',
        displayName: 'Alice Brown',
        photoURL: 'https://example.com/avatar4.jpg'
      }),
      User.create({
        email: 'charlie.davis@example.com',
        displayName: 'Charlie Davis'
      })
    ];

    mockUsers.forEach(user => {
      this.entities.set(user.id, user);
    });
  }

  /**
   * Add mock user (for testing)
   */
  addMockUser(user: User): void {
    this.addMockEntity(user);
  }
}
