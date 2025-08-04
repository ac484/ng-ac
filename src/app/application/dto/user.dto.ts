import { BaseCreateDto, BaseUpdateDto, BaseResponseDto, ListResponseDto, SearchCriteriaDto, BaseStatsDto } from './base.dto';
import { UserStatus } from '../../domain/entities/user.entity';

// Re-export domain types for convenience
export type { UserStatus };

/**
 * DTO for creating a new user
 * Extends BaseCreateDto for consistency with base application service
 */
export interface CreateUserDto extends BaseCreateDto {
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
}

/**
 * DTO for updating user profile
 * Extends BaseUpdateDto for consistency with base application service
 */
export interface UpdateUserDto extends BaseUpdateDto {
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
 * Extends BaseResponseDto for consistency with base application service
 */
export interface UserDto extends BaseResponseDto {
  email: string;
  displayName: string;
  status: string;
  photoURL?: string;
  phoneNumber?: string;
  isAnonymous?: boolean;
  isEmailVerified?: boolean;
  authProvider?: string;
}

/**
 * DTO for user list response
 * 使用標準化的 ListResponseDto 格式
 */
export interface UserListDto extends ListResponseDto<UserDto> {
  // 繼承標準列表回應格式
  // 向後相容性：保留舊的屬性名稱
  users: UserDto[]; // Alias for items
}

/**
 * DTO for user search/filter criteria
 * 擴展標準化的 SearchCriteriaDto
 */
export interface UserSearchDto extends SearchCriteriaDto {
  email?: string;
  displayName?: string;
  authProvider?: string;
  isEmailVerified?: boolean;
  isAnonymous?: boolean;
}

/**
 * DTO for user statistics
 * 擴展標準化的 BaseStatsDto
 */
export interface UserStatsDto extends BaseStatsDto {
  totalUsers: number; // Alias for compatibility with total
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  emailVerified: number;
  anonymous: number;
  byAuthProvider: Record<string, number>;
}
