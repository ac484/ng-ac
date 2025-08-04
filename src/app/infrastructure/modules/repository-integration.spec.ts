import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { USER_REPOSITORY, ACCOUNT_REPOSITORY, TRANSACTION_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { provideRepositories } from '../providers/repository.providers';

// Mock Firestore for testing
const mockFirestore = {
  collection: jasmine.createSpy('collection'),
  doc: jasmine.createSpy('doc')
};

describe('Repository Integration Test', () => {
  describe('Repository Module Integration', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [...provideRepositories({ useMockRepositories: true }), { provide: Firestore, useValue: mockFirestore }]
      });
    });

    it('should provide all required repositories', () => {
      // Test that all repositories can be injected
      expect(() => TestBed.inject(USER_REPOSITORY)).not.toThrow();
      expect(() => TestBed.inject(ACCOUNT_REPOSITORY)).not.toThrow();
      expect(() => TestBed.inject(TRANSACTION_REPOSITORY)).not.toThrow();
    });

    it('should provide working repository instances', () => {
      const userRepository = TestBed.inject(USER_REPOSITORY);
      const accountRepository = TestBed.inject(ACCOUNT_REPOSITORY);
      const transactionRepository = TestBed.inject(TRANSACTION_REPOSITORY);

      // Verify repositories are defined and have expected methods
      expect(userRepository).toBeDefined();
      expect(typeof userRepository.findById).toBe('function');
      expect(typeof userRepository.findAll).toBe('function');
      expect(typeof userRepository.save).toBe('function');
      expect(typeof userRepository.delete).toBe('function');

      expect(accountRepository).toBeDefined();
      expect(typeof accountRepository.findById).toBe('function');
      expect(typeof accountRepository.findAll).toBe('function');
      expect(typeof accountRepository.save).toBe('function');
      expect(typeof accountRepository.delete).toBe('function');

      expect(transactionRepository).toBeDefined();
      expect(typeof transactionRepository.findById).toBe('function');
      expect(typeof transactionRepository.findAll).toBe('function');
      expect(typeof transactionRepository.save).toBe('function');
      expect(typeof transactionRepository.delete).toBe('function');
    });
  });

  describe('Configuration Flexibility', () => {
    it('should work with different configurations', () => {
      // Test with mock repositories
      TestBed.configureTestingModule({
        providers: [
          ...provideRepositories({
            useMockRepositories: true,
            enableOptimizedRepositories: true
          }),
          { provide: Firestore, useValue: mockFirestore }
        ]
      });

      const userRepo1 = TestBed.inject(USER_REPOSITORY);
      expect(userRepo1).toBeDefined();

      // Reset and test with Firebase repositories
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ...provideRepositories({
            useMockRepositories: false,
            enableOptimizedRepositories: true
          }),
          { provide: Firestore, useValue: mockFirestore }
        ]
      });

      const userRepo2 = TestBed.inject(USER_REPOSITORY);
      expect(userRepo2).toBeDefined();
    });
  });

  describe('Legacy Compatibility', () => {
    it('should maintain backward compatibility', () => {
      // Test that the new system works as a drop-in replacement
      TestBed.configureTestingModule({
        providers: [...provideRepositories(), { provide: Firestore, useValue: mockFirestore }]
      });

      // Should be able to inject all the same repositories as before
      expect(() => TestBed.inject(USER_REPOSITORY)).not.toThrow();
      expect(() => TestBed.inject(ACCOUNT_REPOSITORY)).not.toThrow();
      expect(() => TestBed.inject(TRANSACTION_REPOSITORY)).not.toThrow();
    });
  });
});
