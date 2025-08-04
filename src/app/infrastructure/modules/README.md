# Infrastructure Modules

This directory contains Angular modules that organize and configure infrastructure concerns.

## RepositoryModule

The `RepositoryModule` provides a unified way to configure and manage all repository dependency injection in the application.

### Features

- **Centralized Configuration**: All repository providers are managed in one place
- **Environment-based Selection**: Automatically choose between Firebase and Mock repositories based on configuration
- **Type Safety**: Full TypeScript support with proper typing
- **Testing Support**: Easy configuration for testing environments
- **Optimized Repository Support**: Seamlessly integrates optimized repositories where available

### Usage

#### Basic Usage (in app.config.ts)

```typescript
import { provideRepositories } from './infrastructure/providers/repository.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    ...provideRepositories(),
  ]
};
```

#### Custom Configuration

```typescript
import { provideRepositories } from './infrastructure/providers/repository.providers';

// Use mock repositories for development
...provideRepositories({
  useMockRepositories: true,
  enableOptimizedRepositories: true
})

// Production configuration
...provideRepositories({
  useMockRepositories: false,
  enableOptimizedRepositories: true
})
```

#### Testing Configuration

```typescript
import { provideRepositoriesForTesting } from './infrastructure/providers/repository.providers';

TestBed.configureTestingModule({
  providers: [
    ...provideRepositoriesForTesting()
  ]
});
```

### Configuration Options

- `useMockRepositories`: Whether to use mock repositories instead of Firebase repositories
- `enableOptimizedRepositories`: Whether to use optimized repository implementations where available

### Supported Repositories

Currently configured repositories:

- ✅ **UserRepository**: OptimizedUserRepository (Firebase) / MockUserRepository (Mock)
- ✅ **AccountRepository**: OptimizedFirebaseAccountRepository (Firebase) / OptimizedMockAccountRepository (Mock)
- ✅ **TransactionRepository**: OptimizedFirebaseTransactionRepository (Firebase) / OptimizedMockTransactionRepository (Mock)
- ✅ **AuthRepository**: FirebaseAuthRepository (Legacy implementation)
- ✅ **PrincipalRepository**: FirebasePrincipalRepository (Firebase) / MockPrincipalRepository (Mock)
- ✅ **ContractRepository**: FirebaseContractRepository

Repositories to be added in future iterations:
- ⏳ **RoleRepository**: Not yet implemented
- ⏳ **PermissionRepository**: Not yet implemented

### Migration from Legacy Providers

The new repository module replaces the old `repository.providers.ts` and `contract.providers.ts` files:

#### Before (Legacy)
```typescript
import { getRepositoryProviders } from './infrastructure/di/repository.providers';
import { CONTRACT_PROVIDERS } from './infrastructure/di/contract.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    ...getRepositoryProviders(),
    ...CONTRACT_PROVIDERS,
  ]
};
```

#### After (New)
```typescript
import { provideRepositories } from './infrastructure/providers/repository.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    ...provideRepositories(),
  ]
};
```

### Benefits

1. **Simplified Configuration**: Single function call instead of multiple provider arrays
2. **Better Type Safety**: Full TypeScript support with proper interfaces
3. **Environment Awareness**: Automatic selection based on environment
4. **Testing Friendly**: Easy configuration for different testing scenarios
5. **Future Proof**: Easy to add new repositories as they are implemented
6. **Maintainable**: Centralized configuration reduces duplication and errors