// Infrastructure Layer Exports
// This layer handles external dependencies, technical concerns, and infrastructure services

// Services
export * from './services/startup.service';
export * from './services/i18n.service';
export * from './services/firebase-auth.service';

// Adapters
export * from './adapters/firebase-auth.adapter';
export * from './adapters/delon-auth.adapter';

// Repositories
export * from './repositories/firebase-user.repository';
export * from './repositories/firebase-account.repository';
export * from './repositories/firebase-transaction.repository';
export * from './repositories/mock-user.repository';
export * from './repositories/mock-account.repository';
export * from './repositories/mock-transaction.repository';

// Interceptors
export * from './interceptors/ddd-auth.interceptor';
export * from './interceptors/refresh-token';
export * from './interceptors/helper';

// New Unified Repository Module and Providers
export * from './modules/repository.module';
export * from './providers/repository.providers';

// Legacy Dependency Injection (deprecated)
export { FIREBASE_REPOSITORY_PROVIDERS, MOCK_REPOSITORY_PROVIDERS } from './di/repository.providers'; 