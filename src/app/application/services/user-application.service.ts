import { Injectable, Inject } from '@angular/core';
import { USER_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { ConversionUtilitiesService } from '../../domain/services/conversion-utilities.service';
import { BaseApplicationService, SearchCriteriaDto } from './base-application.service';
import { ErrorHandlerService } from './error-handler.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserStatusDto,
  UserDto,
  UserListDto,
  UserSearchDto,
  UserStatsDto
} from '../dto/user.dto';

/**
 * Refactored User Application Service using BaseApplicationService
 * Eliminates duplicate CRUD logic and standardizes error handling
 * Focuses on user-specific business logic and DTO mapping
 */
@Injectable({
  providedIn: 'root'
})
export class UserApplicationService extends BaseApplicationService<User, CreateUserDto, UpdateUserDto, UserDto> {

  constructor(
    @Inject(USER_REPOSITORY) userRepository: UserRepository,
    errorHandler: ErrorHandlerService,
    private userDomainService: UserDomainService,
    private conversionUtilities: ConversionUtilitiesService
  ) {
    super(userRepository, errorHandler, 'UserApplicationService');
  }

  // Implementation of abstract methods from BaseApplicationService

  /**
   * Create user entity from DTO
   * Implements BaseApplicationService.createEntity
   */
  protected async createEntity(dto: CreateUserDto): Promise<User> {
    // Check business rule: user uniqueness
    const existingUser = await (this.repository as UserRepository).findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Delegate to domain service for entity creation
    return this.userDomainService.createUser(
      dto.email,
      dto.displayName,
      dto.photoURL
    );
  }

  /**
   * Update user entity with DTO data
   * Implements BaseApplicationService.updateEntity
   */
  protected async updateEntity(entity: User, dto: UpdateUserDto): Promise<void> {
    // Delegate to domain service for updates
    if (dto.displayName !== undefined) {
      this.userDomainService.updateUserProfile(entity, dto.displayName, dto.photoURL);
    }

    // Note: Email updates are not supported through profile updates for security reasons
    // Email updates should be handled through a separate secure process
  }

  /**
   * Map user entity to response DTO
   * Implements BaseApplicationService.mapToResponseDto
   */
  protected mapToResponseDto(entity: User): UserDto {
    return {
      id: entity.id,
      email: entity.email,
      displayName: entity.displayName,
      status: entity.status,
      photoURL: entity.photoURL,
      phoneNumber: entity.phoneNumber,
      isAnonymous: entity.isAnonymous,
      isEmailVerified: entity.isEmailVerified,
      authProvider: entity.authProvider,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  // Override search and filtering methods for user-specific logic

  /**
   * Filter users by keyword (email or display name)
   * Overrides BaseApplicationService.filterByKeyword
   */
  protected override async filterByKeyword(entities: User[], keyword: string): Promise<User[]> {
    const lowerKeyword = keyword.toLowerCase();
    return entities.filter(user =>
      user.email.toLowerCase().includes(lowerKeyword) ||
      user.displayName.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Filter users by status
   * Overrides BaseApplicationService.filterByStatus
   */
  protected override async filterByStatus(entities: User[], status: string): Promise<User[]> {
    return entities.filter(user => user.status === status);
  }

  /**
   * Apply user-specific sorting
   * Overrides BaseApplicationService.applySorting
   */
  protected override async applySorting(
    entities: User[],
    sortBy: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<User[]> {
    const sorted = [...entities];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'displayName':
          aValue = a.displayName;
          bValue = b.displayName;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastLoginAt':
          aValue = a.lastLoginAt || new Date(0);
          bValue = b.lastLoginAt || new Date(0);
          break;
        default:
          // Fall back to base class sorting for unknown fields
          aValue = (a as any)[sortBy];
          bValue = (b as any)[sortBy];
          if (aValue === undefined && bValue === undefined) return 0;
          if (aValue === undefined) return sortOrder === 'asc' ? 1 : -1;
          if (bValue === undefined) return sortOrder === 'asc' ? -1 : 1;
      }

      // Handle different data types
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return sorted;
  }

  // User-specific business methods

  /**
   * Get user by email
   * User-specific method not covered by base CRUD operations
   */
  async getUserByEmail(email: string): Promise<UserDto | null> {
    const operation = 'getUserByEmail';
    this.logger.info(`Getting user by email`, { email });

    try {
      const user = await (this.repository as UserRepository).findByEmail(email);
      return user ? this.mapToResponseDto(user) : null;
    } catch (error) {
      this.logger.error(`Failed to get user by email`, error, { email });
      throw this.errorHandler.handleError(error, operation);
    }
  }

  /**
   * Update user status
   * User-specific business operation
   */
  async updateUserStatus(userId: string, updateStatusDto: UpdateUserStatusDto): Promise<UserDto> {
    const operation = 'updateUserStatus';
    this.logger.info(`Updating user status`, { userId, status: updateStatusDto.status });

    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Use centralized conversion and delegate to domain service
      const newStatus = this.conversionUtilities.stringToUserStatus(updateStatusDto.status);
      this.userDomainService.updateUserStatus(user, newStatus);

      // Persist changes
      await this.repository.save(user);

      this.logger.info(`Successfully updated user status`, { userId, newStatus });
      this.errorHandler.handleSuccess('User status updated successfully');

      return this.mapToResponseDto(user);
    } catch (error) {
      this.logger.error(`Failed to update user status`, error, { userId, status: updateStatusDto.status });
      throw this.errorHandler.handleError(error, operation);
    }
  }

  /**
   * Get all users with optional filtering
   * Uses base class getList method with user-specific search criteria conversion
   */
  async getAllUsers(searchDto?: UserSearchDto): Promise<UserListDto> {
    const operation = 'getAllUsers';
    this.logger.info(`Getting all users`, { searchDto });

    try {
      // Convert UserSearchDto to SearchCriteriaDto
      const criteria: SearchCriteriaDto | undefined = searchDto ? {
        keyword: searchDto.email || searchDto.displayName,
        status: searchDto.status,
        page: searchDto.page,
        pageSize: searchDto.pageSize
      } : undefined;

      // Use base class method
      const result = await this.getList(criteria);

      // Convert to UserListDto format for backward compatibility
      return {
        items: result.items,
        users: result.items, // Alias for backward compatibility
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious
      };
    } catch (error) {
      this.logger.error(`Failed to get all users`, error, { searchDto });
      throw this.errorHandler.handleError(error, operation);
    }
  }

  /**
   * Get user statistics
   * User-specific business method
   */
  async getUserStats(): Promise<UserStatsDto> {
    const operation = 'getUserStats';
    this.logger.info(`Getting user statistics`);

    try {
      const allUsers = await this.repository.findAll();

      const stats = {
        total: allUsers.length,
        totalUsers: allUsers.length, // Alias for compatibility
        active: allUsers.filter(u => u.status === 'active').length,
        inactive: allUsers.filter(u => u.status === 'inactive').length,
        pending: 0, // No longer using pending status
        suspended: allUsers.filter(u => u.status === 'suspended').length,
        emailVerified: allUsers.filter(u => u.email && u.email.includes('@')).length, // Simple check
        anonymous: 0, // No anonymous users in current system
        byAuthProvider: {
          'email': allUsers.length // All users use email auth for now
        }
      };

      this.logger.info(`Successfully retrieved user statistics`, stats);
      return stats;
    } catch (error) {
      this.logger.error(`Failed to get user statistics`, error);
      throw this.errorHandler.handleError(error, operation);
    }
  }

  // Convenience methods that delegate to base class methods

  /**
   * Create user - delegates to base class create method
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    return this.create(createUserDto);
  }

  /**
   * Get user by ID - delegates to base class getById method
   */
  async getUserById(id: string): Promise<UserDto | null> {
    return this.getById(id);
  }

  /**
   * Update user profile - delegates to base class update method
   */
  async updateUserProfile(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    return this.update(id, updateUserDto);
  }

  /**
   * Delete user - delegates to base class delete method
   */
  async deleteUser(id: string): Promise<void> {
    return this.delete(id);
  }
}