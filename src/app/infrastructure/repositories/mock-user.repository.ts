import { Injectable } from '@angular/core';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

/**
 * Mock implementation of UserRepository for testing and development
 * Uses in-memory storage instead of Firebase
 */
@Injectable({
  providedIn: 'root'
})
export class MockUserRepository implements UserRepository {

  private users = new Map<string, User>();

  constructor() {
    // Initialize with some mock data
    this.initializeMockData();
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    // Simulate network delay
    await this.delay(100);
    return this.users.get(id) || null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    await this.delay(100);
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  /**
   * Find all users with optional status filtering
   */
  async findAll(status?: string): Promise<User[]> {
    await this.delay(200);
    let users = Array.from(this.users.values());
    
    if (status) {
      users = users.filter(user => user.status.getValue() === status);
    }
    
    return users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Save user (create or update)
   */
  async save(user: User): Promise<void> {
    await this.delay(150);
    this.users.set(user.id, user);
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<void> {
    await this.delay(100);
    this.users.delete(id);
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    await this.delay(50);
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    await this.delay(50);
    return this.users.size;
  }

  /**
   * Find users by status
   */
  async findByStatus(status: string): Promise<User[]> {
    await this.delay(100);
    const users = Array.from(this.users.values());
    return users
      .filter(user => user.status.getValue() === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Initialize mock data for testing
   */
  private initializeMockData(): void {
    const mockUsers = [
      User.create(
        'user_1',
        'john.doe@example.com',
        'John Doe',
        'https://example.com/avatar1.jpg',
        false,
        false,
        'email',
        'password'
      ),
      User.create(
        'user_2',
        'jane.smith@example.com',
        'Jane Smith',
        'https://example.com/avatar2.jpg',
        false,
        false,
        'email',
        'password'
      ),
      User.create(
        'user_3',
        'bob.wilson@example.com',
        'Bob Wilson',
        undefined,
        false,
        false,
        'email',
        'password'
      ),
      User.create(
        'user_4',
        'alice.brown@example.com',
        'Alice Brown',
        'https://example.com/avatar4.jpg',
        false,
        false,
        'email',
        'password'
      ),
      User.create(
        'user_5',
        'charlie.davis@example.com',
        'Charlie Davis',
        undefined,
        false,
        false,
        'email',
        'password'
      )
    ];

    mockUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  /**
   * Simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear all mock data (for testing)
   */
  clearMockData(): void {
    this.users.clear();
  }

  /**
   * Add mock user (for testing)
   */
  addMockUser(user: User): void {
    this.users.set(user.id, user);
  }
} 