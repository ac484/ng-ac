import { Injectable, Inject } from '@angular/core';
import { USER_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { UserStatus } from '../../domain/value-objects/status/user-status.value-object';
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
 * User application service orchestrating domain operations
 * 簡化：使用實體的現有方法，統一錯誤處理
 */
@Injectable({
  providedIn: 'root'
})
export class UserApplicationService {

  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    private userDomainService: UserDomainService
  ) {}

  /**
   * Create a new user
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create user using domain service
      const user = this.userDomainService.createUser(
        createUserDto.email,
        createUserDto.displayName,
        createUserDto.photoURL
      );

      // Save user
      await this.userRepository.save(user);

      return this.mapToDto(user);
    } catch (error) {
      throw this.handleError('create user', error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserDto | null> {
    try {
      const user = await this.userRepository.findById(id);
      return user ? this.mapToDto(user) : null;
    } catch (error) {
      throw this.handleError('get user', error);
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserDto | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return user ? this.mapToDto(user) : null;
    } catch (error) {
      throw this.handleError('get user by email', error);
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      if (updateUserDto.displayName) {
        this.userDomainService.updateUserProfile(user, updateUserDto.displayName, updateUserDto.photoURL);
      }

      await this.userRepository.save(user);
      return this.mapToDto(user);
    } catch (error) {
      throw this.handleError('update user profile', error);
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, updateStatusDto: UpdateUserStatusDto): Promise<UserDto> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const newStatus = this.convertStringToUserStatus(updateStatusDto.status);
      this.userDomainService.updateUserStatus(user, newStatus);
      await this.userRepository.save(user);

      return this.mapToDto(user);
    } catch (error) {
      throw this.handleError('update user status', error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      await this.userRepository.delete(id);
    } catch (error) {
      throw this.handleError('delete user', error);
    }
  }

  /**
   * Get all users with optional filtering
   */
  async getAllUsers(searchDto?: UserSearchDto): Promise<UserListDto> {
    try {
      const users = await this.userRepository.findAll(searchDto?.status);
      const filteredUsers = this.filterUsers(users, searchDto);
      
      const total = filteredUsers.length;
      const page = searchDto?.page || 1;
      const pageSize = searchDto?.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        users: paginatedUsers.map(user => this.mapToDto(user)),
        total,
        page,
        pageSize
      };
    } catch (error) {
      throw this.handleError('get users', error);
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStatsDto> {
    try {
      const allUsers = await this.userRepository.findAll();
      
      return {
        total: allUsers.length,
        totalUsers: allUsers.length, // Alias for compatibility
        active: allUsers.filter(u => u.status.getValue() === 'Active').length,
        inactive: allUsers.filter(u => u.status.getValue() === 'Inactive').length,
        pending: allUsers.filter(u => u.status.getValue() === 'Pending').length,
        suspended: allUsers.filter(u => u.status.getValue() === 'Suspended').length
      };
    } catch (error) {
      throw this.handleError('get user statistics', error);
    }
  }

  /**
   * Filter users based on search criteria
   */
  private filterUsers(users: User[], searchDto?: UserSearchDto): User[] {
    if (!searchDto) return users;

    return users.filter(user => {
      if (searchDto.status && user.status.getValue() !== searchDto.status) return false;
      if (searchDto.email && !user.email.getValue().toLowerCase().includes(searchDto.email.toLowerCase())) return false;
      if (searchDto.displayName && !user.displayName.getValue().toLowerCase().includes(searchDto.displayName.toLowerCase())) return false;
      return true;
    });
  }

  /**
   * Map domain entity to DTO
   * 簡化：使用實體的現有方法
   */
  private mapToDto(user: User): UserDto {
    const summary = user.getSummary();
    return {
      id: summary.id,
      email: summary.email,
      displayName: summary.displayName,
      photoURL: user.photoUrl.getValue() || undefined,
      status: summary.status,
      isAnonymous: summary.isAnonymous,
      isEmailVerified: summary.isEmailVerified,
      authProvider: summary.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * 統一錯誤處理
   */
  private handleError(operation: string, error: any): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Error(`Failed to ${operation}: ${message}`);
  }

  // 添加轉換方法
  private convertStringToUserStatus(statusString: string): UserStatus {
    switch (statusString.toUpperCase()) {
      case 'ACTIVE':
        return UserStatus.ACTIVE();
      case 'SUSPENDED':
        return UserStatus.SUSPENDED();
      case 'BANNED':
        return UserStatus.BANNED();
      case 'PENDING':
        return UserStatus.PENDING();
      case 'INACTIVE':
        return UserStatus.INACTIVE();
      default:
        throw new Error(`Invalid user status: ${statusString}`);
    }
  }
} 