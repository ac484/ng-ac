import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import {
    provideRepositories,
    provideRepositoriesForTesting,
    provideRepositoriesForDevelopment,
    provideRepositoriesForProduction,
    getRepositoryProviders
} from './repository.providers';
import {
    USER_REPOSITORY,
    ACCOUNT_REPOSITORY,
    TRANSACTION_REPOSITORY
} from '../../domain/repositories/repository-tokens';

// Mock Firestore
const mockFirestore = jasmine.createSpyObj('Firestore', ['collection', 'doc']);

describe('Repository Providers', () => {

    describe('provideRepositories', () => {
        it('should return an array of providers', () => {
            const providers = provideRepositories();

            expect(Array.isArray(providers)).toBe(true);
            expect(providers.length).toBeGreaterThan(0);
        });

        it('should accept custom configuration', () => {
            const providers = provideRepositories({
                useMockRepositories: true,
                enableOptimizedRepositories: false
            });

            expect(Array.isArray(providers)).toBe(true);
            expect(providers.length).toBeGreaterThan(0);
        });

        it('should provide working repository instances', () => {
            TestBed.configureTestingModule({
                providers: [
                    ...provideRepositories(),
                    { provide: Firestore, useValue: mockFirestore }
                ]
            });

            const userRepository = TestBed.inject(USER_REPOSITORY);
            const accountRepository = TestBed.inject(ACCOUNT_REPOSITORY);
            const transactionRepository = TestBed.inject(TRANSACTION_REPOSITORY);

            expect(userRepository).toBeDefined();
            expect(accountRepository).toBeDefined();
            expect(transactionRepository).toBeDefined();
        });
    });

    describe('provideRepositoriesForTesting', () => {
        it('should return providers configured for testing', () => {
            const providers = provideRepositoriesForTesting();

            expect(Array.isArray(providers)).toBe(true);
            expect(providers.length).toBeGreaterThan(0);
        });

        it('should provide working repository instances for testing', () => {
            TestBed.configureTestingModule({
                providers: [
                    ...provideRepositoriesForTesting(),
                    { provide: Firestore, useValue: mockFirestore }
                ]
            });

            const userRepository = TestBed.inject(USER_REPOSITORY);
            expect(userRepository).toBeDefined();
        });
    });

    describe('provideRepositoriesForDevelopment', () => {
        it('should return providers configured for development', () => {
            const providers = provideRepositoriesForDevelopment();

            expect(Array.isArray(providers)).toBe(true);
            expect(providers.length).toBeGreaterThan(0);
        });

        it('should accept useMocks parameter', () => {
            const providersWithMocks = provideRepositoriesForDevelopment(true);
            const providersWithoutMocks = provideRepositoriesForDevelopment(false);

            expect(Array.isArray(providersWithMocks)).toBe(true);
            expect(Array.isArray(providersWithoutMocks)).toBe(true);
        });
    });

    describe('provideRepositoriesForProduction', () => {
        it('should return providers configured for production', () => {
            const providers = provideRepositoriesForProduction();

            expect(Array.isArray(providers)).toBe(true);
            expect(providers.length).toBeGreaterThan(0);
        });
    });

    describe('getRepositoryProviders (legacy)', () => {
        it('should return providers and show deprecation warning', () => {
            spyOn(console, 'warn');

            const providers = getRepositoryProviders();

            expect(Array.isArray(providers)).toBe(true);
            expect(providers.length).toBeGreaterThan(0);
            expect(console.warn).toHaveBeenCalledWith('getRepositoryProviders() is deprecated. Use provideRepositories() instead.');
        });
    });

    describe('Integration Test', () => {
        it('should work with different configurations', () => {
            // Test with mock repositories
            TestBed.configureTestingModule({
                providers: [
                    ...provideRepositories({ useMockRepositories: true }),
                    { provide: Firestore, useValue: mockFirestore }
                ]
            });

            let userRepository = TestBed.inject(USER_REPOSITORY);
            expect(userRepository).toBeDefined();

            // Reset TestBed
            TestBed.resetTestingModule();

            // Test with Firebase repositories
            TestBed.configureTestingModule({
                providers: [
                    ...provideRepositories({ useMockRepositories: false }),
                    { provide: Firestore, useValue: mockFirestore }
                ]
            });

            userRepository = TestBed.inject(USER_REPOSITORY);
            expect(userRepository).toBeDefined();
        });
    });
});