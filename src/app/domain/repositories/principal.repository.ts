import { Principal } from '../entities/principal.entity';

/**
 * Repository interface for Principal entity
 * Defines the contract for principal data access operations
 */
export interface PrincipalRepository {
  /**
   * Find principal by ID
   */
  findById(id: string): Promise<Principal | null>;

  /**
   * Find principal by name
   */
  findByName(name: string): Promise<Principal | null>;

  /**
   * Find all principals with optional status filtering
   */
  findAll(status?: string): Promise<Principal[]>;

  /**
   * Save principal (create or update)
   */
  save(principal: Principal): Promise<void>;

  /**
   * Delete principal by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if principal exists by name
   */
  existsByName(name: string): Promise<boolean>;

  /**
   * Get total count of principals
   */
  count(): Promise<number>;

  /**
   * Find principals by status
   */
  findByStatus(status: string): Promise<Principal[]>;
}
