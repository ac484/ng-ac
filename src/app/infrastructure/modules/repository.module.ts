import { NgModule, Provider, InjectionToken } from '@angular/core';
import { environment } from '@env/environment';

// Repository Tokens
import {
    USER_REPOSITORY,
    ACCOUNT_REPOSITORY,
    TRANSACTION_REPOSITORY,
    AUTH_REPOSITORY,
    PRINCIPAL_REPOSITORY
    // Note: ROLE_REPOSITORY and PERMISSION_REPOSITORY are not yet implemented
} from '../../domain/repositories/repository-tokens';
import { CONTRACT_REPOSITORY_TOKEN } from '../../domain/repositories/contract.repository';

// Optimized Firebase Repository Implementations
import { OptimizedUserRepository } from '../repositories/optimized-user.repository';
import { OptimizedFirebaseAccountRepository } from '../repositories/optimized-firebase-account.repository';
import { OptimizedFirebaseTransactionRepository } from '../repositories/optimized-firebase-transaction.repository';

// Legacy Firebase Repository Implementations (for repositories not yet optimized)
import { FirebaseAuthRepository } from '../repositories/firebase-auth.repository';
import { FirebasePrincipalRepository } from '../repositories/firebase-principal.repository';
import { FirebaseContractRepository } from '../repositories/firebase-contract.repository';

// Mock Repository Implementations
import { OptimizedMockAccountRepository } from '../repositories/optimized-mock-account.repository';
import { OptimizedMockTransactionRepository } from '../repositories/optimized-mock-transaction.repository';
import { MockUserRepository } from '../repositories/mock-user.repository';
import { MockPrincipalRepository } from '../repositories/mock-principal.repository';

// Domain Services
import { ContractDomainService } from '../../domain/services/contract-domain.service';

/**
 * Repository configuration interface for type safety
 */
export interface RepositoryConfig {
    useMockRepositories: boolean;
    enableOptimizedRepositories: boolean;
}

/**
 * Default repository configuration
 */
export const DEFAULT_REPOSITORY_CONFIG: RepositoryConfig = {
    useMockRepositories: environment.production ? false : false, // Set to true for development with mocks
    enableOptimizedRepositories: true // Use optimized repositories where available
};

/**
 * Repository configuration token
 */
export const REPOSITORY_CONFIG = new InjectionToken<RepositoryConfig>('RepositoryConfig');

/**
 * Factory function to create repository providers based on configuration
 */
export function createRepositoryProviders(config: RepositoryConfig): Provider[] {
    const providers: Provider[] = [];

    // User Repository
    if (config.useMockRepositories) {
        providers.push({
            provide: USER_REPOSITORY,
            useClass: MockUserRepository
        });
    } else {
        providers.push({
            provide: USER_REPOSITORY,
            useClass: config.enableOptimizedRepositories ? OptimizedUserRepository : MockUserRepository
        });
    }

    // Account Repository
    if (config.useMockRepositories) {
        providers.push({
            provide: ACCOUNT_REPOSITORY,
            useClass: OptimizedMockAccountRepository
        });
    } else {
        providers.push({
            provide: ACCOUNT_REPOSITORY,
            useClass: OptimizedFirebaseAccountRepository
        });
    }

    // Transaction Repository
    if (config.useMockRepositories) {
        providers.push({
            provide: TRANSACTION_REPOSITORY,
            useClass: OptimizedMockTransactionRepository
        });
    } else {
        providers.push({
            provide: TRANSACTION_REPOSITORY,
            useClass: OptimizedFirebaseTransactionRepository
        });
    }

    // Auth Repository (not yet optimized, using legacy implementation)
    providers.push({
        provide: AUTH_REPOSITORY,
        useClass: FirebaseAuthRepository
    });

    // Principal Repository (not yet optimized, using legacy implementation)
    if (config.useMockRepositories) {
        providers.push({
            provide: PRINCIPAL_REPOSITORY,
            useClass: MockPrincipalRepository
        });
    } else {
        providers.push({
            provide: PRINCIPAL_REPOSITORY,
            useClass: FirebasePrincipalRepository
        });
    }

    // Contract Repository
    providers.push({
        provide: CONTRACT_REPOSITORY_TOKEN,
        useClass: FirebaseContractRepository
    });

    // Domain Services
    providers.push(ContractDomainService);

    // Note: ROLE_REPOSITORY and PERMISSION_REPOSITORY providers will be added
    // when the corresponding repository implementations are created

    return providers;
}

/**
 * Unified Repository Module
 * 
 * This module centralizes all repository dependency injection configuration,
 * providing a clean and maintainable way to manage repository providers.
 * 
 * Features:
 * - Environment-based repository selection (Firebase vs Mock)
 * - Support for optimized repositories
 * - Type-safe configuration
 * - Centralized provider management
 * - Easy testing configuration
 */
@NgModule({
    providers: [
        // Provide default configuration
        {
            provide: REPOSITORY_CONFIG,
            useValue: DEFAULT_REPOSITORY_CONFIG
        },
        // Create repository providers based on configuration
        {
            provide: 'REPOSITORY_PROVIDERS',
            useFactory: createRepositoryProviders,
            deps: [REPOSITORY_CONFIG],
            multi: false
        }
    ]
})
export class RepositoryModule {

    /**
     * Configure the repository module with custom settings
     * 
     * @param config Repository configuration
     * @returns ModuleWithProviders for the repository module
     */
    static forRoot(config: Partial<RepositoryConfig> = {}): {
        ngModule: typeof RepositoryModule;
        providers: Provider[]
    } {
        const finalConfig: RepositoryConfig = {
            ...DEFAULT_REPOSITORY_CONFIG,
            ...config
        };

        return {
            ngModule: RepositoryModule,
            providers: [
                {
                    provide: REPOSITORY_CONFIG,
                    useValue: finalConfig
                },
                ...createRepositoryProviders(finalConfig)
            ]
        };
    }

    /**
     * Configure the repository module for testing with mock repositories
     * 
     * @returns ModuleWithProviders configured for testing
     */
    static forTesting(): {
        ngModule: typeof RepositoryModule;
        providers: Provider[]
    } {
        return this.forRoot({
            useMockRepositories: true,
            enableOptimizedRepositories: true
        });
    }

    /**
     * Configure the repository module for development with optional mock repositories
     * 
     * @param useMocks Whether to use mock repositories
     * @returns ModuleWithProviders configured for development
     */
    static forDevelopment(useMocks: boolean = false): {
        ngModule: typeof RepositoryModule;
        providers: Provider[]
    } {
        return this.forRoot({
            useMockRepositories: useMocks,
            enableOptimizedRepositories: true
        });
    }

    /**
     * Configure the repository module for production
     * 
     * @returns ModuleWithProviders configured for production
     */
    static forProduction(): {
        ngModule: typeof RepositoryModule;
        providers: Provider[]
    } {
        return this.forRoot({
            useMockRepositories: false,
            enableOptimizedRepositories: true
        });
    }
}