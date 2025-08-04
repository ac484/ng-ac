import { UserStatus } from '../../domain/entities/user.entity';

// Re-export domain types for convenience
export { UserStatus };

/**
 * DTO for creating a new user
 */
export interface CreateUserDto {
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
}

/**
 * DTO for updating user profile
 */
export interface UpdateUserDto {
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
}

/**
 * DTO for updating user status
 */
export interface UpdateUserStatusDto {
  status: string;
}

/**
 * DTO for user response data
 */
export interface UserDto {
  id: string;
  email: string;
  displayName: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  photoURL?: string;
  phoneNumber?: string;
  isAnonymous?: boolean;
  isEmailVerified?: boolean;
  authProvider?: string;
}

/**
 * DTO for user list response
 */
export interface UserListDto {
  users: UserDto[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * DTO for user search/filter criteria
 */
export interface UserSearchDto {
  status?: string;
  email?: string;
  displayName?: string;
  page?: number;
  pageSize?: number;
}

/**
 * DTO for user statistics
 */
export interface UserStatsDto {
  total: number;
  totalUsers: number; // Alias for compatibility
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
} 