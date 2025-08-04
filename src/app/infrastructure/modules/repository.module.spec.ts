import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { RepositoryModule, RepositoryConfig, REPOSITORY_CONFIG } from './repository.module';
import { CONTRACT_REPOSITORY_TOKEN } from '../../domain/repositories/contract.repository';
import {
  USER_REPOSITORY,
  ACCOUNT_REPOSITORY,
  TRANSACTION_REPOSITORY,
  AUTH_REPOSITORY,
  PRINCIPAL_REPOSITORY
} from '../../domain/repositories/repository-tokens';

// Mock Firestore
const mockFirestore = jasmine.createSpyObj('Firestore', ['collection', 'doc']);

describe('RepositoryModule', () => {
  describe('forRoot', () => {
    it('should provide default configuration', () => {
      const moduleWithProviders = RepositoryModule.forRoot();

      expect(moduleWithProviders.ngModule).toBe(RepositoryModule);
      expect(moduleWithProviders.providers).toBeDefined();
      expect(moduleWithProviders.providers.length).toBeGreaterThan(0);
    });

    it('should accept custom configuration', () => {
      const customConfig: Partial<RepositoryConfig> = {
        useMockRepositories: true,
        enableOptimizedRepositories: false
      };

      const moduleWithProviders = RepositoryModule.forRoot(customConfig);

      expect(moduleWithProviders.ngModule).toBe(RepositoryModule);
      expect(moduleWithProviders.providers).toBeDefined();
    });
  });

  describe('forTesting', () => {
    it('should configure for testing with mock repositories', () => {
      const moduleWithProviders = RepositoryModule.forTesting();

      expect(moduleWithProviders.ngModule).toBe(RepositoryModule);
      expect(moduleWithProviders.providers).toBeDefined();
    });
  });

  describe('forDevelopment', () => {
    it('should configure for development', () => {
      const moduleWithProviders = RepositoryModule.forDevelopment();

      expect(moduleWithProviders.ngModule).toBe(RepositoryModule);
      expect(moduleWithProviders.providers).toBeDefined();
    });

    it('should configure for development with mocks', () => {
      const moduleWithProviders = RepositoryModule.forDevelopment(true);

      expect(moduleWithProviders.ngModule).toBe(RepositoryModule);
      expect(moduleWithProviders.providers).toBeDefined();
    });
  });

  describe('forProduction', () => {
    it('should configure for production', () => {
      const moduleWithProviders = RepositoryModule.forProduction();

      expect(moduleWithProviders.ngModule).toBe(RepositoryModule);
      expect(moduleWithProviders.providers).toBeDefined();
    });
  });

  describe('Repository Provider Integration', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [...RepositoryModule.forTesting().providers, { provide: Firestore, useValue: mockFirestore }]
      });
    });

    it('should provide USER_REPOSITORY', () => {
      const userRepository = TestBed.inject(USER_REPOSITORY);
      expect(userRepository).toBeDefined();
    });

    it('should provide ACCOUNT_REPOSITORY', () => {
      const accountRepository = TestBed.inject(ACCOUNT_REPOSITORY);
      expect(accountRepository).toBeDefined();
    });

    it('should provide TRANSACTION_REPOSITORY', () => {
      const transactionRepository = TestBed.inject(TRANSACTION_REPOSITORY);
      expect(transactionRepository).toBeDefined();
    });

    it('should provide AUTH_REPOSITORY', () => {
      const authRepository = TestBed.inject(AUTH_REPOSITORY);
      expect(authRepository).toBeDefined();
    });

    it('should provide PRINCIPAL_REPOSITORY', () => {
      const principalRepository = TestBed.inject(PRINCIPAL_REPOSITORY);
      expect(principalRepository).toBeDefined();
    });

    it('should provide CONTRACT_REPOSITORY_TOKEN', () => {
      const contractRepository = TestBed.inject(CONTRACT_REPOSITORY_TOKEN);
      expect(contractRepository).toBeDefined();
    });
  });

  describe('Configuration', () => {
    it('should use provided configuration', () => {
      const customConfig: RepositoryConfig = {
        useMockRepositories: true,
        enableOptimizedRepositories: true
      };

      TestBed.configureTestingModule({
        providers: [
          { provide: REPOSITORY_CONFIG, useValue: customConfig },
          { provide: Firestore, useValue: mockFirestore }
        ]
      });

      const config = TestBed.inject(REPOSITORY_CONFIG);
      expect(config).toEqual(customConfig);
    });
  });
});
