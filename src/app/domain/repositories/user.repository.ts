import { User } from '../entities/user.entity';

/**
 * User repository interface defining standard CRUD operations
 * Implementations will handle data persistence using Firebase or other storage
 */
export interface UserRepository {
  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find all users with optional filtering
   */
  findAll(status?: string): Promise<User[]>;

  /**
   * Save user (create or update)
   */
  save(user: User): Promise<void>;

  /**
   * Delete user by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if user exists by email
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Count total users
   */
  count(): Promise<number>;

  /**
   * Find users by status
   */
  findByStatus(status: string): Promise<User[]>;
} 