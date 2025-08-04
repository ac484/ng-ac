/**
 * Repository injection tokens
 * Provides injection tokens for repository interfaces
 */
import { InjectionToken } from '@angular/core';

import { AccountRepository } from './account.repository';
import { AuthRepository } from './auth.repository';
import { PermissionRepository } from './permission.repository';
import { PrincipalRepository } from './principal.repository';
import { RoleRepository } from './role.repository';
import { TransactionRepository } from './transaction.repository';
import { UserRepository } from './user.repository';

export const USER_REPOSITORY = new InjectionToken<UserRepository>('UserRepository');
export const ACCOUNT_REPOSITORY = new InjectionToken<AccountRepository>('AccountRepository');
export const TRANSACTION_REPOSITORY = new InjectionToken<TransactionRepository>('TransactionRepository');
export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AuthRepository');
export const ROLE_REPOSITORY = new InjectionToken<RoleRepository>('RoleRepository');
export const PERMISSION_REPOSITORY = new InjectionToken<PermissionRepository>('PermissionRepository');
export const PRINCIPAL_REPOSITORY = new InjectionToken<PrincipalRepository>('PrincipalRepository');
