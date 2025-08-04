import { Provider } from '@angular/core';
import { environment } from '@env/environment';
import { RepositoryModule, RepositoryConfig } from '../modules/repository.module';

/**
 * Simplified repository providers function
 * 
 * This function provides a clean way to get repository providers
 * for use in the application configuration without importing the full module.
 */
export function provideRepositories(config?: Partial<RepositoryConfig>): Provider[] {
    // Determine configuration based on environment
    const defaultConfig: RepositoryConfig = {
        useMockRepositories: !environment.production && false, // Set to true for development with mocks
        enableOptimizedRepositories: true
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Get providers from the repository module
    const moduleWithProviders = RepositoryModule.forRoot(finalConfig);
    return moduleWithProviders.providers;
}

/**
 * Provide repositories for testing environment
 */
export function provideRepositoriesForTesting(): Provider[] {
    return RepositoryModule.forTesting().providers;
}

/**
 * Provide repositories for development environment
 */
export function provideRepositoriesForDevelopment(useMocks: boolean = false): Provider[] {
    return RepositoryModule.forDevelopment(useMocks).providers;
}

/**
 * Provide repositories for production environment
 */
export function provideRepositoriesForProduction(): Provider[] {
    return RepositoryModule.forProduction().providers;
}

/**
 * Legacy compatibility function
 * @deprecated Use provideRepositories() instead
 */
export function getRepositoryProviders(): Provider[] {
    console.warn('getRepositoryProviders() is deprecated. Use provideRepositories() instead.');
    return provideRepositories();
}