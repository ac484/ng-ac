import { Provider } from '@angular/core';
import { USER_REPOSITORY, ACCOUNT_REPOSITORY, TRANSACTION_REPOSITORY, AUTH_REPOSITORY, PRINCIPAL_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { FirebaseUserRepository } from '../repositories/firebase-user.repository';
import { MockUserRepository } from '../repositories/mock-user.repository';
import { FirebaseAccountRepository } from '../repositories/firebase-account.repository';
import { MockAccountRepository } from '../repositories/mock-account.repository';
import { FirebaseTransactionRepository } from '../repositories/firebase-transaction.repository';
import { MockTransactionRepository } from '../repositories/mock-transaction.repository';
import { FirebaseAuthRepository } from '../repositories/firebase-auth.repository';
import { FirebasePrincipalRepository } from '../repositories/firebase-principal.repository';
import { MockPrincipalRepository } from '../repositories/mock-principal.repository';

/**
 * Repository providers for dependency injection
 * Configure which repository implementation to use
 */

// Use Firebase repository for production
export const FIREBASE_REPOSITORY_PROVIDERS: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: FirebaseUserRepository
  },
  {
    provide: ACCOUNT_REPOSITORY,
    useClass: FirebaseAccountRepository
  },
  {
    provide: TRANSACTION_REPOSITORY,
    useClass: FirebaseTransactionRepository
  },
  {
    provide: AUTH_REPOSITORY,
    useClass: FirebaseAuthRepository
  },
  {
    provide: PRINCIPAL_REPOSITORY,
    useClass: FirebasePrincipalRepository
  }
];

// Use Mock repository for development/testing
export const MOCK_REPOSITORY_PROVIDERS: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: MockUserRepository
  },
  {
    provide: ACCOUNT_REPOSITORY,
    useClass: MockAccountRepository
  },
  {
    provide: TRANSACTION_REPOSITORY,
    useClass: MockTransactionRepository
  },
  {
    provide: AUTH_REPOSITORY,
    useClass: FirebaseAuthRepository
  },
  {
    provide: PRINCIPAL_REPOSITORY,
    useClass: MockPrincipalRepository
  }
];

// Environment-based repository selection
export function getRepositoryProviders(): Provider[] {
  // In production, use Firebase repositories
  // In development, you can choose between Firebase and Mock
  const useMock = false; // Set to false to use Firebase repositories
  
  return useMock ? MOCK_REPOSITORY_PROVIDERS : FIREBASE_REPOSITORY_PROVIDERS;
} 